"use client";

import { graphqlClient } from "@/lib/graphql/client";
import {
    GET_CART,
    SAVE_CART,
    CLEAR_CART,
} from "@/graphql/cart";
import { getProductThumbnail } from "@/lib/utils";
import { CartItem, CartQueryResponse } from "@/types/cart";

export function useGraphQLCart() {
    /**
     * Fetch logged-in user's cart
     */
    async function getCart(): Promise<CartItem[]> {
        const data =
            await graphqlClient.request<CartQueryResponse>(
                GET_CART
            );

        return data.cart.items.map((item) => ({
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            image: getProductThumbnail(item.product),
            quantity: item.quantity,
        }));
    }

    /**
     * Save entire cart
     */
    async function saveCart(items: CartItem[]) {
        await graphqlClient.request(SAVE_CART, {
            items,
        });
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