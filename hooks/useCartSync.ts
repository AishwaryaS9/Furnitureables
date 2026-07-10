"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

import { useCartStore } from "@/store/cart";

export function useCartSync() {
    const { user } = useUser();

    const items = useCartStore((s) => s.items);
    const cartReady = useCartStore((s) => s.cartReady);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);


    useEffect(() => {
        if (!user) return;

        if (!cartReady) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            try {
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
                            items: items.map((item) => ({
                                productId: item.id,
                                quantity: item.quantity,
                            })),
                        },
                    }),
                });
            } catch (err) {
                console.error(err);
            }
        }, 500);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [items, cartReady, user]);
}