export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
}

export interface SalesChartPoint {
    date: string;
    revenue: number;
}

export interface LowStockProduct {
    id: string;
    title: string;
    sku: string;
    stock: number;
}

export type RecentOrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

export interface RecentOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    createdAt: string;
    total: number;
    currency: string;
    status: RecentOrderStatus;
}
