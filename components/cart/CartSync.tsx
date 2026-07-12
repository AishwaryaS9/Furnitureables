
"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

import { useCartStore } from "@/store/cart";
import { mergeCart } from "@/lib/mergeCart";

import { useCartSync } from "@/hooks/useCartSync";

export default function CartSync() {
    const { user, isLoaded } = useUser();

    const items = useCartStore((s) => s.items);
    const setCart = useCartStore((s) => s.setCart);
    const clearCart = useCartStore((s) => s.clearCart);
    const setCartReady = useCartStore((s) => s.setCartReady);

    useCartSync();

    const initialized = useRef(false);

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            initialized.current = false;
            clearCart();
            setCartReady(false);
            return;
        }

        if (initialized.current) return;

        initialized.current = true;

        async function initializeCart() {
            try {
                const res = await fetch("/api/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `
                        query{
                            cart{
                                items{
                                    quantity
                                    product{
                                        id
                                        title
                                        price
                                        image
                                    }
                                }
                            }
                        }
                        `,
                    }),
                });

                const json = await res.json();

                const dbItems =
                    json.data.cart?.items?.map((item: any) => ({
                        id: item.product.id,
                        title: item.product.title,
                        price: item.product.price,
                        image: item.product.media,
                        quantity: item.quantity,
                    })) ?? [];

                const merged = mergeCart(items, dbItems);

                await fetch("/api/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `
                        mutation SaveCart($items:[CartItemInput!]!){
                            saveCart(items:$items){
                                id
                            }
                        }
                        `,
                        variables: {
                            items: merged.map((item) => ({
                                productId: item.id,
                                quantity: item.quantity,
                            })),
                        },
                    }),
                });

                setCart(merged);

                setCartReady(true);
            } catch (err) {
                console.error(err);
            }
        }

        initializeCart();
    }, [user, isLoaded]);

    return null;
}