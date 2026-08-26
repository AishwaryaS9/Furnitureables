import { prisma } from "@/lib/prisma";
import { Order } from "@/generated/prisma";

interface ConfirmStripeOrderResult {
    order: Order;
    justConfirmed: boolean;
}

export async function confirmStripeOrderPayment(
    orderId: string
): Promise<ConfirmStripeOrderResult | null> {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { items: true, coupon: true },
        });

        if (!order) {
            return null;
        }

        if (order.paymentStatus === "PAID") {
            return { order, justConfirmed: false };
        }

        // Reduce stock
        for (const item of order.items) {
            const updated = await tx.product.updateMany({
                where: {
                    id: item.productId,
                    stock: { gte: item.quantity },
                },
                data: {
                    stock: { decrement: item.quantity },
                },
            });

            if (updated.count === 0) {
                throw new Error(`${item.title} is out of stock`);
            }
        }

        // Increment coupon usage
        if (order.couponId) {
            await tx.coupon.update({
                where: { id: order.couponId },
                data: { usedCount: { increment: 1 } },
            });
        }

        // Update order
        const updatedOrder = await tx.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: "PAID",
                status: "CONFIRMED",
            },
        });

        // Clear cart
        await tx.cartItem.deleteMany({
            where: { cart: { userId: order.userId } },
        });

        return { order: updatedOrder, justConfirmed: true };
    });
}
