"use client";

import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { GET_WISHLIST } from "@/lib/graphql/queries";
import { WishlistResponse } from "@/types/wishlist";

export function useWishlist(enabled: boolean) {
    return useQuery({
        queryKey: ["wishlist"],
        enabled,
        queryFn: () =>
            graphqlClient.request<WishlistResponse>(GET_WISHLIST),
    });
}