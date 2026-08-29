import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ADMIN_PRODUCTS } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";
import { Product } from "@/types/product";

interface UseAdminProductsParams {
    search?: string;
    page?: number;
    limit?: number;
}

export interface AdminProductsResult {
    items: Product[];
    total: number;
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    inventoryValue: number;
}

export function useAdminProducts({
    search = "",
    page = 1,
    limit = 8,
}: UseAdminProductsParams = {}) {
    return useQuery({
        queryKey: ["admin-products", search, page, limit],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminProducts: AdminProductsResult;
            }>(ADMIN_PRODUCTS, {
                search: search || undefined,
                page,
                limit,
            });

            return data.adminProducts;
        },
        placeholderData: keepPreviousData,
    });
}
