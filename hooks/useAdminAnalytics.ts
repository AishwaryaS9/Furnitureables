import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import {
    ADMIN_CATEGORY_PERFORMANCE,
    ADMIN_CATEGORY_REVENUE_SHARE,
    ADMIN_CUSTOMER_GROWTH,
    ADMIN_ORDER_FUNNEL,
    ADMIN_ORDER_STATUS_DISTRIBUTION,
    ADMIN_PAYMENT_METHOD_DISTRIBUTION,
    ADMIN_RATING_DISTRIBUTION,
    ADMIN_REVENUE_TREND,
    ADMIN_STOCK_VS_SALES,
    ADMIN_TOP_PRODUCTS,
} from "@/lib/graphql/queries";
import {
    CategoryPerformance,
    CategoryRevenueShare,
    CustomerGrowthPoint,
    OrderFunnelStage,
    OrderStatusSlice,
    PaymentMethodSlice,
    RatingDistributionSlice,
    RevenueTrendPoint,
    StockVsSalesPoint,
    TopProduct,
} from "@/types/analytics";

export function useAdminRevenueTrend(days: number = 30) {
    return useQuery({
        queryKey: ["admin-revenue-trend", days],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminRevenueTrend: RevenueTrendPoint[];
            }>(ADMIN_REVENUE_TREND, { days });

            return data.adminRevenueTrend;
        },
    });
}

export function useAdminOrderStatusDistribution() {
    return useQuery({
        queryKey: ["admin-order-status-distribution"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminOrderStatusDistribution: OrderStatusSlice[];
            }>(ADMIN_ORDER_STATUS_DISTRIBUTION);

            return data.adminOrderStatusDistribution;
        },
    });
}

export function useAdminTopProducts(limit: number = 5) {
    return useQuery({
        queryKey: ["admin-top-products", limit],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminTopProducts: TopProduct[];
            }>(ADMIN_TOP_PRODUCTS, { limit });

            return data.adminTopProducts;
        },
    });
}

export function useAdminCategoryPerformance() {
    return useQuery({
        queryKey: ["admin-category-performance"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminCategoryPerformance: CategoryPerformance[];
            }>(ADMIN_CATEGORY_PERFORMANCE);

            return data.adminCategoryPerformance;
        },
    });
}

export function useAdminCustomerGrowth(months: number = 6) {
    return useQuery({
        queryKey: ["admin-customer-growth", months],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminCustomerGrowth: CustomerGrowthPoint[];
            }>(ADMIN_CUSTOMER_GROWTH, { months });

            return data.adminCustomerGrowth;
        },
    });
}

export function useAdminPaymentMethodDistribution() {
    return useQuery({
        queryKey: ["admin-payment-method-distribution"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminPaymentMethodDistribution: PaymentMethodSlice[];
            }>(ADMIN_PAYMENT_METHOD_DISTRIBUTION);

            return data.adminPaymentMethodDistribution;
        },
    });
}

export function useAdminRatingDistribution() {
    return useQuery({
        queryKey: ["admin-rating-distribution"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminRatingDistribution: RatingDistributionSlice[];
            }>(ADMIN_RATING_DISTRIBUTION);

            return data.adminRatingDistribution;
        },
    });
}

export function useAdminStockVsSales(limit: number = 20) {
    return useQuery({
        queryKey: ["admin-stock-vs-sales", limit],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminStockVsSales: StockVsSalesPoint[];
            }>(ADMIN_STOCK_VS_SALES, { limit });

            return data.adminStockVsSales;
        },
    });
}

export function useAdminCategoryRevenueShare() {
    return useQuery({
        queryKey: ["admin-category-revenue-share"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminCategoryRevenueShare: CategoryRevenueShare[];
            }>(ADMIN_CATEGORY_REVENUE_SHARE);

            return data.adminCategoryRevenueShare;
        },
    });
}

export function useAdminOrderFunnel() {
    return useQuery({
        queryKey: ["admin-order-funnel"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminOrderFunnel: OrderFunnelStage[];
            }>(ADMIN_ORDER_FUNNEL);

            return data.adminOrderFunnel;
        },
    });
}
