import { prisma } from "@/lib/prisma";
import { notifyAdminOfNewOrder } from "@/lib/notifications/createAdminNotification";
import { sendOrderInvoiceEmail } from "./sendOrderInvoiceEmail";

export async function sendOrderConfirmedSideEffects(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
            id: true,
            orderNumber: true,
            fullName: true,
            total: true,
            currency: true,
        },
    });

    if (!order) {
        console.error(`[order-confirmed] Order ${orderId} not found; skipping side effects.`);
        return;
    }

    await Promise.allSettled([
        notifyAdminOfNewOrder({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName: order.fullName,
            total: order.total,
            currency: order.currency,
        }),
        sendOrderInvoiceEmail(order.id),
    ]);
}
