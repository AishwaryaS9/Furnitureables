import { useQuery } from "@tanstack/react-query";
import { ADMIN_PRODUCTS } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";

export function useAdminProducts() {
    return useQuery({
        queryKey: ["admin-products"],
        queryFn: async () => {
            const data = await graphqlClient.request(ADMIN_PRODUCTS);
            return data.adminProducts;
        },
    });
}