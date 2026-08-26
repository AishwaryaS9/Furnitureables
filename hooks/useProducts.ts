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

interface UseProductsOptions {
  ignoreGlobalFilters?: boolean;
  page?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { ignoreGlobalFilters = false, page: pageOverride } = options;

  const storeFilters = useFilterStore((state) => state.filters);
  const storePage = useFilterStore((state) => state.page);

  const filters = ignoreGlobalFilters ? {} : storeFilters;
  const page = pageOverride ?? (ignoreGlobalFilters ? 1 : storePage);

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== "" && value !== undefined)
  );

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