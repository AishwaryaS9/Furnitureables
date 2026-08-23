import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { VerifyRazorpayPaymentInput } from "@/types/razorpay";
import { sendOrderConfirmedSideEffects } from "@/lib/order/onOrderConfirmed";

async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export const paymentResolver = {
    Mutation: {
        verifyRazorpayPayment: async (
            _: unknown,
            {
                orderId,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
            }: VerifyRazorpayPaymentInput
        ) => {
            const user = await getCurrentUser();

            const order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    userId: user.id,
                },
                include: {
                    items: true,
                },
            });

            if (!order) {
                throw new Error("Order not found.");
            }

            // Already verified
            if (order.paymentStatus === "PAID") {
                return prisma.order.findUnique({
                    where: {
                        id: order.id
                    },
                    include: {
                        coupon: true,
                        items: {
                            include: {
                                product: true
                            }
                        }
                    },
                });
            }

            if (order.razorpayOrderId !== razorpayOrderId) {
                throw new Error("Order mismatch.");
            }

            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest("hex");

            if (expectedSignature !== razorpaySignature) {
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        paymentStatus: "FAILED",
                    },
                });

                throw new Error("Payment verification failed.");
            }

            const confirmedOrder = await prisma.$transaction(async (tx) => {
                // Reduce stock now that payment is confirmed
                for (const item of order.items) {
                    const updated = await tx.product.updateMany({
                        where: {
                            id: item.productId,
                            stock: {
                                gte: item.quantity,
                            },
                        },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });

                    if (updated.count === 0) {
                        throw new Error(`${item.title} is out of stock`);
                    }
                }

                // Increment coupon usage
                if (order.couponId) {
                    await tx.coupon.update({
                        where: {
                            id: order.couponId,
                        },
                        data: {
                            usedCount: {
                                increment: 1,
                            },
                        },
                    });
                }

                // Clear the user's cart now that the order is paid
                const cart = await tx.cart.findUnique({
                    where: { userId: user.id },
                });

                if (cart) {
                    await tx.cartItem.deleteMany({
                        where: { cartId: cart.id },
                    });
                }

                return tx.order.update({
                    where: { id: order.id },
                    data: {
                        status: "CONFIRMED",
                        paymentStatus: "PAID",
                        razorpayPaymentId,
                        razorpaySignature,
                    },
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });
            });

            void sendOrderConfirmedSideEffects(confirmedOrder.id).catch((error) => {
                console.error("Failed to run post-order side effects:", error);
            });

            return confirmedOrder;
        },
    },
};
