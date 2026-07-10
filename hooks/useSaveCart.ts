"use client";

import { useMutation } from "@tanstack/react-query";

export function useSaveCart() {
    return useMutation({
        mutationFn: async (items: any[]) => {
            const res = await fetch("/api/graphql", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    query: `
            mutation SaveCart($items:[CartItemInput!]!) {
              saveCart(items:$items){
                id
              }
            }
          `,
                    variables: {
                        items,
                    },
                }),
            });

            return res.json();
        },
    });
}