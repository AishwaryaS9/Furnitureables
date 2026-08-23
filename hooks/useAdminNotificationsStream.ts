import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminNotification } from "@/types/notification";
import { ADMIN_NOTIFICATIONS_QUERY_KEY, ADMIN_UNREAD_NOTIFICATION_COUNT_QUERY_KEY } from "./useAdminNotifications";

const STREAM_URL = "/api/admin/notifications/stream";

export function useAdminNotificationsStream() {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (typeof window === "undefined" || typeof EventSource === "undefined") {
            return;
        }

        const source = new EventSource(STREAM_URL);

        const handleNotification = (event: MessageEvent<string>) => {
            let notification: AdminNotification;
            try {
                notification = JSON.parse(event.data);
            } catch {
                return;
            }

            queryClient.setQueriesData<AdminNotification[]>(
                { queryKey: ADMIN_NOTIFICATIONS_QUERY_KEY },
                (old) => {
                    if (!old) return old;
                    if (old.some((item) => item.id === notification.id)) return old;
                    return [notification, ...old];
                }
            );

            queryClient.setQueryData<number>(
                ADMIN_UNREAD_NOTIFICATION_COUNT_QUERY_KEY,
                (old) => (old ?? 0) + 1
            );

            toast.info(notification.title, {
                description: notification.message,
            });
        };

        source.addEventListener("notification", handleNotification);

        source.onerror = () => {
        };

        return () => {
            source.removeEventListener("notification", handleNotification);
            source.close();
        };
    }, [queryClient]);
}
