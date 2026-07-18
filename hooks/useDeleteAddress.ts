"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { DELETE_ADDRESS } from "@/lib/graphql/mutations";
import { DeleteAddressResponse } from "@/types/address";

export function useDeleteAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return graphqlClient.request<DeleteAddressResponse>(
                DELETE_ADDRESS,
                {
                    id,
                }
            );
        },

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["addresses"],
            });
        },
    });
}