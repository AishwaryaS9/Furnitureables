"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { CLEAR_CART } from "@/lib/graphql/mutations";
import { useUser } from "@clerk/nextjs";

export function useClearCart() {
    const queryClient = useQueryClient();

    const { user } = useUser();

    return useMutation({
        mutationFn: () =>
            graphqlClient.request(CLEAR_CART),

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["cart", user?.id],
            });
        },
    });
}