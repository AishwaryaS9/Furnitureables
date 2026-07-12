import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { DELETE_PRODUCT } from "@/lib/graphql/mutations";

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return graphqlClient.request(DELETE_PRODUCT, {
                id,
            });
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-products"],
            });
        },
    });
}