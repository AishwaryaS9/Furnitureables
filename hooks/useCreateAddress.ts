"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { CREATE_ADDRESS } from "@/lib/graphql/mutations";
import {
    AddressInput,
    AddressMutationResponse,
} from "@/types/address";

export function useCreateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AddressInput) => {
            return graphqlClient.request<AddressMutationResponse>(
                CREATE_ADDRESS,
                {
                    input,
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