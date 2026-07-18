"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { SET_DEFAULT_ADDRESS } from "@/lib/graphql/mutations";
import { SetDefaultAddressResponse } from "@/types/address";

export function useSetDefaultAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return graphqlClient.request<SetDefaultAddressResponse>(
                SET_DEFAULT_ADDRESS,
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