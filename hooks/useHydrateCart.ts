"use client";

import { useCartStore } from "@/store/cart";
import { graphqlClient } from "@/lib/graphql/client";
import { GET_CART } from "@/lib/graphql/queries";
import { CartQueryResponse } from "@/types/cart";
import { mapServerCartItems } from "@/lib/cartMapper";

export function useHydrateCart() {
    const setCart = useCartStore((s) => s.setCart);

    return async () => {
        const data = await graphqlClient.request<CartQueryResponse>(
            GET_CART
        );

        if (!data.cart) return;

        setCart(mapServerCartItems(data.cart.items));
    };
}