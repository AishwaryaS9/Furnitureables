"use client";

import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { PLACE_ORDER } from "@/lib/graphql/mutations";
import { PlaceOrderInput, PlaceOrderResponse } from "@/types/order";

export function usePlaceOrder() {
    return useMutation({
        mutationFn: async (
            input: PlaceOrderInput
        ) => {
            return graphqlClient.request<PlaceOrderResponse>(
                PLACE_ORDER,
                {
                    input,
                }
            );
        },
    });
}