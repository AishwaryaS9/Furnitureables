"use client";

import { useQuery } from "@tanstack/react-query";

export function useCart() {
  return useQuery({
    queryKey: ["cart"],

    queryFn: async () => {
      const res = await fetch("/api/graphql", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          query: `
            query {
              cart {
                id

                items {
                  quantity

                  productId

                  product {
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

      return json.data.cart;
    },
  });
}