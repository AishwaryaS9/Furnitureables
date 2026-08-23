import { prisma } from "@/lib/prisma";
import { AdminNotificationType } from "@/generated/prisma";
import { publishAdminNotification } from "./events";

interface CreateAdminNotificationInput {
    type?: AdminNotificationType;
    title: string;
    message: string;
    orderId?: string | null;
}

export async function createAdminNotification({
    type = "ORDER_PLACED",
    title,
    message,
    orderId = null,
}: CreateAdminNotificationInput) {
    try {
        const notification = await prisma.adminNotification.create({
            data: { type, title, message, orderId },
        });

        publishAdminNotification({
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            orderId: notification.orderId,
            isRead: notification.isRead,
            createdAt: notification.createdAt.toISOString(),
        });

        return notification;
    } catch (error) {
        console.error("Failed to create admin notification:", error);
        return null;
    }
}

export async function notifyAdminOfNewOrder({
    orderId,
    orderNumber,
    customerName,
    total,
    currency,
}: {
    orderId: string;
    orderNumber: string;
    customerName: string;
    total: number;
    currency: string;
}) {
    const formattedTotal = (() => {
        try {
            return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
            }).format(total);
        } catch {
            return `${currency} ${total.toFixed(0)}`;
        }
    })();

    return createAdminNotification({
        type: "ORDER_PLACED",
        title: "New order placed",
        message: `${customerName} placed order #${orderNumber} for ${formattedTotal}.`,
        orderId,
    });
}
