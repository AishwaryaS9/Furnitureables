import { useQuery } from "@tanstack/react-query";
import { ADMIN_LOW_STOCK_PRODUCTS } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";
import { LowStockProduct } from "@/types/dashboard";

export function useAdminLowStockProducts(
    threshold: number = 10,
    limit: number = 5
) {
    return useQuery({
        queryKey: ["admin-low-stock-products", threshold, limit],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminLowStockProducts: LowStockProduct[];
            }>(ADMIN_LOW_STOCK_PRODUCTS, { threshold, limit });

            return data.adminLowStockProducts;
        },
    });
}
