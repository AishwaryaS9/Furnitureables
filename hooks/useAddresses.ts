"use client";

import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { GET_ADDRESSES } from "@/lib/graphql/queries";
import { AddressesQueryResponse } from "@/types/address";

export function useAddresses(userId?: string) {
    return useQuery({
        queryKey: ["addresses", userId ?? "anonymous"],

        queryFn: async () => {
            const data =
                await graphqlClient.request<AddressesQueryResponse>(
                    GET_ADDRESSES
                );

            return data.addresses;
        },

        enabled: !!userId,
    });
}