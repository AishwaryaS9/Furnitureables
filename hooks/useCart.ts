"use client";

import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { GET_CART } from "@/lib/graphql/queries";
import { CartQueryResponse } from "@/types/cart";
export function useCart(userId?: string) {
  return useQuery({
    queryKey: ["cart", userId ?? "anonymous"],
    queryFn: async () => {
      const data = await graphqlClient.request<CartQueryResponse>(GET_CART);
      return data.cart;
    },
    enabled: !!userId,
  });
}