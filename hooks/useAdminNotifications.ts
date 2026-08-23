import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { ADMIN_NOTIFICATIONS, ADMIN_UNREAD_NOTIFICATION_COUNT } from "@/lib/graphql/queries";
import { ADMIN_MARK_NOTIFICATION_READ, ADMIN_MARK_ALL_NOTIFICATIONS_READ } from "@/lib/graphql/mutations";
import { AdminNotification } from "@/types/notification";

export const ADMIN_NOTIFICATIONS_QUERY_KEY = ["admin-notifications"] as const;
export const ADMIN_UNREAD_NOTIFICATION_COUNT_QUERY_KEY = ["admin-unread-notification-count"] as const;

export function useAdminNotifications(limit = 20) {
    return useQuery({
        queryKey: [...ADMIN_NOTIFICATIONS_QUERY_KEY, limit],
        queryFn: async () => {
            const data = await graphqlClient.request<{ adminNotifications: AdminNotification[] }>(
                ADMIN_NOTIFICATIONS,
                { limit }
            );
            return data.adminNotifications;
        },
    });
}

export function useAdminUnreadNotificationCount() {
    return useQuery({
        queryKey: ADMIN_UNREAD_NOTIFICATION_COUNT_QUERY_KEY,
        queryFn: async () => {
            const data = await graphqlClient.request<{ adminUnreadNotificationCount: number }>(
                ADMIN_UNREAD_NOTIFICATION_COUNT
            );
            return data.adminUnreadNotificationCount;
        },
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return graphqlClient.request<{ adminMarkNotificationRead: AdminNotification }>(
                ADMIN_MARK_NOTIFICATION_READ,
                { id }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_NOTIFICATIONS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ADMIN_UNREAD_NOTIFICATION_COUNT_QUERY_KEY });
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            return graphqlClient.request<{ adminMarkAllNotificationsRead: boolean }>(
                ADMIN_MARK_ALL_NOTIFICATIONS_READ
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_NOTIFICATIONS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ADMIN_UNREAD_NOTIFICATION_COUNT_QUERY_KEY });
        },
    });
}
