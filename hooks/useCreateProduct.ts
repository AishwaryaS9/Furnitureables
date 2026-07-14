import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CREATE_PRODUCT } from "@/lib/graphql/mutations";
import { graphqlClient } from "@/lib/graphql/client";
import { Product, ProductFormData } from "@/types/product";

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: ProductFormData) => {
            return graphqlClient.request<{
                product: Product;
            }>(CREATE_PRODUCT, {
                input,
            });
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-products"],
            });
        },
    });
}