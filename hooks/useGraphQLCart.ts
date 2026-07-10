"use client";

import { graphqlClient } from "@/lib/graphql/client";
import { GET_CART, SAVE_CART, CLEAR_CART } from "@/graphql/cart";

export type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
};

export function useGraphQLCart() {
    /**
     * Fetch logged-in user's cart
     */
    async function getCart(): Promise<CartItem[]> {
        const data = await graphqlClient.request<{
            cart: {
                items: CartItem[];
            };
        }>(GET_CART);

        return data.cart.items;
    }

    /**
     * Save entire cart
     */
    async function saveCart(items: CartItem[]) {
        await graphqlClient.request(
            SAVE_CART,
            {
                items,
            }
        );
    }

    /**
     * Clear user's cart
     */
    async function clearCart() {
        await graphqlClient.request(CLEAR_CART);
    }

    return {
        getCart,
        saveCart,
        clearCart,
    };
}