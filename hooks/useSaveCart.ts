"use client";

import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { SAVE_CART } from "@/lib/graphql/mutations";

interface SaveCartItem {
    productId: string;
    quantity: number;
}

export function useSaveCart() {
    return useMutation({
        mutationFn: async (items: SaveCartItem[]) => {
            const result = await graphqlClient.request(SAVE_CART, { items });
            return result;
        },
        onError(error) {
            console.error("SAVE CART ERROR:", error);
        },
    });
}
