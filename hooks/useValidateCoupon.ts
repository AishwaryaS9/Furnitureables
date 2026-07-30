"use client";

import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { VALIDATE_COUPON } from "@/lib/graphql/queries";

export function useValidateCoupon() {
    return useMutation({
        mutationFn: async ({
            code,
            subtotal,
        }: {
            code: string;
            subtotal: number;
        }) => {
            return graphqlClient.request(
                VALIDATE_COUPON,
                {
                    code,
                    subtotal,
                }
            );
        },
    });
}