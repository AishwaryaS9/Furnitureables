"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { REMOVE_CART_ITEM } from "@/lib/graphql/mutations";
import { useUser } from "@clerk/nextjs";

export function useRemoveCartItem() {
    const queryClient = useQueryClient();

    const { user } = useUser();

    const mutation = useMutation({
        mutationFn: (productId: string) =>
            graphqlClient.request(
                REMOVE_CART_ITEM,
                {
                    productId,
                }
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart", user?.id],
            });
        },
    });

    return {
        remove: (productId: string) =>
            mutation.mutate(productId),
    };
}