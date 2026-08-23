import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth/admin";

async function assertAdmin() {
    const admin = await getAdminUser();
    if (!admin) throw new Error("Forbidden");
    return admin;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const notificationResolvers = {
    Query: {
        adminNotifications: async (_: unknown, { limit }: { limit?: number | null }) => {
            await assertAdmin();

            const take = Math.min(Math.max(limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);

            return prisma.adminNotification.findMany({
                orderBy: { createdAt: "desc" },
                take,
            });
        },

        adminUnreadNotificationCount: async () => {
            await assertAdmin();

            return prisma.adminNotification.count({
                where: { isRead: false },
            });
        },
    },

    Mutation: {
        adminMarkNotificationRead: async (_: unknown, { id }: { id: string }) => {
            await assertAdmin();

            const existing = await prisma.adminNotification.findUnique({ where: { id } });
            if (!existing) throw new Error("Notification not found.");

            if (existing.isRead) return existing;

            return prisma.adminNotification.update({
                where: { id },
                data: { isRead: true },
            });
        },

        adminMarkAllNotificationsRead: async () => {
            await assertAdmin();

            await prisma.adminNotification.updateMany({
                where: { isRead: false },
                data: { isRead: true },
            });

            return true;
        },
    },
};
