export interface RevenueTrendPoint {
    date: string;
    revenue: number;
    orders: number;
}

export interface OrderStatusSlice {
    status: string;
    count: number;
}

export interface TopProduct {
    id: string;
    title: string;
    revenue: number;
    unitsSold: number;
}

export interface CategoryPerformance {
    category: string;
    revenue: number;
    orders: number;
}

export interface CustomerGrowthPoint {
    date: string;
    newCustomers: number;
    totalCustomers: number;
}

export interface PaymentMethodSlice {
    method: string;
    count: number;
    revenue: number;
}

export interface RatingDistributionSlice {
    rating: number;
    count: number;
}

export interface StockVsSalesPoint {
    id: string;
    title: string;
    stock: number;
    unitsSold: number;
}

export interface CategoryRevenueShare {
    name: string;
    value: number;
}

export interface OrderFunnelStage {
    stage: string;
    count: number;
}
