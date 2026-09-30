"use client";

import dynamic from "next/dynamic";

/**
 * recharts is heavy. Every admin chart is code-split and only loaded in the
 * browser, with a placeholder of the same height while it downloads.
 */
function ChartSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading chart"
            className="h-80 w-full animate-pulse rounded-2xl border border-border/50 bg-muted/40"
        />
    );
}

export const RevenueTrendChart = dynamic(() => import("./RevenueTrendChart"), {
    ssr: false,
    loading: ChartSkeleton,
});

export const CustomerGrowthChart = dynamic(() => import("./CustomerGrowthChart"), {
    ssr: false,
    loading: ChartSkeleton,
});

export const PaymentMethodChart = dynamic(() => import("./PaymentMethodChart"), {
    ssr: false,
    loading: ChartSkeleton,
});

export const CategoryPerformanceChart = dynamic(() => import("./CategoryPerformanceChart"), {
    ssr: false,
    loading: ChartSkeleton,
});

export const RatingDistributionChart = dynamic(() => import("./RatingDistributionChart"), {
    ssr: false,
    loading: ChartSkeleton,
});

export const OrderFunnelChart = dynamic(() => import("./OrderFunnelChart"), {
    ssr: false,
    loading: ChartSkeleton,
});

export const OrderStatusChart = dynamic(() => import("./OrderStatusChart"), {
    ssr: false,
    loading: ChartSkeleton,
});

export const TopProductsChart = dynamic(() => import("./TopProductsChart"), {
    ssr: false,
    loading: ChartSkeleton,
});

export const StockVsSalesChart = dynamic(() => import("./StockVsSalesChart"), {
    ssr: false,
    loading: ChartSkeleton,
});

export const RevenueByCategoryChart = dynamic(() => import("./RevenueByCategoryChart"), {
    ssr: false,
    loading: ChartSkeleton,
});
