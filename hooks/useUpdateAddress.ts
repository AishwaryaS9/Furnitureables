"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { UPDATE_ADDRESS } from "@/lib/graphql/mutations";
import {
    AddressInput,
    UpdateAddressResponse,
} from "@/types/address";

interface Variables {
    id: string;
    input: AddressInput;
}

export function useUpdateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            input,
        }: Variables) => {
            const response =
                await graphqlClient.request<UpdateAddressResponse>(
                    UPDATE_ADDRESS,
                    {
                        id,
                        input,
                    }
                );

            return response.updateAddress;
        },

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["addresses"],
            });
        },
    });
}