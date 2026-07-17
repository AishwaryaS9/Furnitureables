import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { PRODUCT_BY_ID } from "@/lib/graphql/queries";
import { Product } from "@/types/product";

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ["product", id],

        queryFn: async () => {
            const data = await graphqlClient.request<{
                product: Product;
            }>(PRODUCT_BY_ID, {
                id,
            });
            return data.product;
        },

        enabled: !!id,
    });
};