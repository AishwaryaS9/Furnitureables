import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { GET_PRODUCT_CATEGORIES } from "@/lib/graphql/queries";

export interface ProductCategory {
    type: string;
    count: number;
}

interface ProductCategoriesResponse {
    productCategories: ProductCategory[];
}

export const useProductCategories = (limit = 5) => {
    return useQuery({
        queryKey: ["productCategories", limit],

        queryFn: async () => {
            const data = await graphqlClient.request<ProductCategoriesResponse>(
                GET_PRODUCT_CATEGORIES,
                { limit }
            );

            return data.productCategories;
        },
        staleTime: 5 * 60 * 1000,
    });
};
