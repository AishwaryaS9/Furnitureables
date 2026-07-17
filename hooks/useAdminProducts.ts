import { useQuery } from "@tanstack/react-query";
import { ADMIN_PRODUCTS } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";
import { Product } from "@/types/product";

export function useAdminProducts() {
    return useQuery({
        queryKey: ["admin-products"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminProducts: Product[];
            }>(ADMIN_PRODUCTS);

            return data.adminProducts;
        },
    });
}