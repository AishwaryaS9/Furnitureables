"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { UPDATE_CART_ITEM } from "@/lib/graphql/mutations";
import { useUser } from "@clerk/nextjs";

export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    const { user } = useUser();

    const mutation = useMutation({
        mutationFn: ({
            productId,
            quantity,
        }: {
            productId: string;
            quantity: number;
        }) =>
            graphqlClient.request(
                UPDATE_CART_ITEM,
                {
                    productId,
                    quantity,
                }
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart", user?.id],
            });
        },
    });

    return {
        increment: (
            productId: string,
            currentQuantity: number
        ) =>
            mutation.mutate({
                productId,
                quantity: currentQuantity + 1,
            }),

        decrement: (
            productId: string,
            currentQuantity: number
        ) =>
            mutation.mutate({
                productId,
                quantity: Math.max(1, currentQuantity - 1),
            }),
    };
}