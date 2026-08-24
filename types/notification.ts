export type AdminNotificationType = "ORDER_PLACED";

export interface AdminNotification {
    id: string;
    type: AdminNotificationType;
    title: string;
    message: string;
    orderId?: string | null;
    isRead: boolean;
    createdAt: string;
}

export interface AdminNotificationEvent {
    id: string;
    type: string;
    title: string;
    message: string;
    orderId: string | null;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationsTableProps {
    notifications: AdminNotification[];
    loading: boolean;
    actionId: string | null;
    onMarkRead: (id: string) => void;
    onViewOrder: (orderId: string) => void;
    currentPage?: number;
    pageSize?: number;
    totalNotifications?: number;
    onPageChange?: (page: number) => void;
}