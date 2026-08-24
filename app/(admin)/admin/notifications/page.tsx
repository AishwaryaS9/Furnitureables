"use client";

import { useMemo, useState } from "react";
import { CheckCheck, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationsTable from "@/components/admin/notifications/NotificationsTable";
import OrderDetailsModal from "@/components/admin/orders/OrderDetailsModal";
import {
    useAdminNotifications,
    useAdminUnreadNotificationCount,
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
} from "@/hooks/useAdminNotifications";
import { useAdminOrders } from "@/hooks/useAdminOrders";

const PAGE_SIZE = 10;

export default function NotificationsPage() {
    const [page, setPage] = useState(1);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const { data: notifications = [], isLoading, isFetching, refetch } = useAdminNotifications(100);
    const { data: unreadCount = 0 } = useAdminUnreadNotificationCount();
    const { data: orders = [] } = useAdminOrders();
    const markOneRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const hasUnread = unreadCount > 0;

    const paginatedNotifications = useMemo(
        () => notifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [notifications, page]
    );

    const selectedOrder = useMemo(
        () => orders.find((order) => order.id === selectedOrderId) ?? null,
        [orders, selectedOrderId]
    );

    const handleViewOrder = (orderId: string) => {
        const order = orders.find((o) => o.id === orderId);
        if (!order) {
            toast.error("Order not found", {
                description: "This order may have been removed.",
            });
            return;
        }
        setSelectedOrderId(orderId);
        setIsOrderModalOpen(true);
    };

    return (
        <main
            id="main-content"
            tabIndex={-1}
            aria-labelledby="notifications-page-heading"
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 focus:outline-none"
        >
            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1
                        id="notifications-page-heading"
                        className="mt-2 font-serif text-3xl sm:text-4xl text-foreground tracking-tight"
                    >
                        Notifications
                    </h1>
                    <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                        Stay on top of new orders and store activity from one place.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => markAllRead.mutate()}
                        disabled={!hasUnread || markAllRead.isPending}
                        aria-label="Mark all notifications as read"
                        className="rounded-xl w-fit shadow-xs"
                    >
                        {markAllRead.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                        )}
                        <span>Mark all read</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="rounded-xl w-fit shadow-xs"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        aria-label={isFetching ? "Refreshing notifications..." : "Refresh notifications list"}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
                        <span>Refresh</span>
                    </Button>
                </div>
            </header>

            <section aria-label="Notifications table" className="space-y-4 w-full">
                <div className="flex items-center justify-end">
                    <div role="status" aria-live="polite" aria-atomic="true" className="shrink-0">
                        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs font-medium">
                            {unreadCount} unread of {notifications.length}{" "}
                            {notifications.length === 1 ? "notification" : "notifications"}
                        </Badge>
                    </div>
                </div>

                <NotificationsTable
                    notifications={paginatedNotifications}
                    loading={isLoading}
                    actionId={markOneRead.isPending ? markOneRead.variables ?? null : null}
                    onMarkRead={(id) => markOneRead.mutate(id)}
                    onViewOrder={handleViewOrder}
                    currentPage={page}
                    pageSize={PAGE_SIZE}
                    totalNotifications={notifications.length}
                    onPageChange={setPage}
                />
            </section>

            <OrderDetailsModal
                order={selectedOrder}
                open={isOrderModalOpen}
                onOpenChange={(open) => {
                    setIsOrderModalOpen(open);
                    if (!open) setSelectedOrderId(null);
                }}
            />
        </main>
    );
}
