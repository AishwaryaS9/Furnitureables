import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

interface VerifyRazorpayPaymentArgs {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
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
            }: VerifyRazorpayPaymentArgs
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

            // Already verified (avoid double-processing on retries)
            if (order.paymentStatus === "PAID") {
                return prisma.order.findUnique({
                    where: { id: order.id },
                    include: { items: { include: { product: true } } },
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

            return prisma.$transaction(async (tx) => {
                // Reduce stock now that payment is confirmed
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
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
        },
    },
};
