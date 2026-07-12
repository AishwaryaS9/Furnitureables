import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CREATE_PRODUCT } from "@/lib/graphql/mutations";
import { graphqlClient } from "@/lib/graphql/client";
import { ProductFormData } from "@/types/product";

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ProductFormData) => {
            return graphqlClient.request(CREATE_PRODUCT, {
                data,
            });
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-products"],
            });
        },
    });
}