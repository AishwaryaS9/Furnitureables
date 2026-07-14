import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { GET_PRODUCTS } from "@/lib/graphql/queries";
import { Product } from "@/types/product";
import { useFilterStore } from "@/store/useFilterStore";

interface ProductsResponse {
  products: {
    items: Product[];
    total: number;
  };
}

export const useProducts = () => {
  const filters = useFilterStore((state) => state.filters);

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== "" && value !== undefined)
  );

  const page = useFilterStore((state) => state.page);

  return useQuery({
    queryKey: ["products", cleanFilters, page],

    queryFn: async () => {
      const data = await graphqlClient.request<ProductsResponse>(
        GET_PRODUCTS,
        {
          filter: cleanFilters,
          page,
        }
      );

      return data.products;
    },
  });
};