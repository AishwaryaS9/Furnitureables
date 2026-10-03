"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { ADD_TO_WISHLIST } from "@/lib/graphql/mutations";

export function useWishlistSync(userId?: string | null, isLoaded?: boolean) {
    const queryClient = useQueryClient();
    const processed = useRef(false);

    useEffect(() => {
        if (!isLoaded || !userId || processed.current) return;

        const productId = localStorage.getItem("pendingWishlist");
        if (!productId) return;

        processed.current = true;

        async function sync() {
            try {
                await graphqlClient.request(ADD_TO_WISHLIST, { productId });
                localStorage.removeItem("pendingWishlist");
                queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            } catch (error) {
                console.error(error);
            }
        }

        sync();
    }, [isLoaded, userId, queryClient]);
}
