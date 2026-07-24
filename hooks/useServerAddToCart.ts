"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { ADD_TO_CART } from "@/lib/graphql/mutations";
import { useUser } from "@clerk/nextjs";

export function useServerAddToCart() {
    const { user } = useUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            productId,
            quantity,
        }: {
            productId: string;
            quantity: number;
        }) => {
            return graphqlClient.request(ADD_TO_CART, {
                productId,
                quantity,
            });
        },

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["cart", user?.id],
            });
        },
    });
}