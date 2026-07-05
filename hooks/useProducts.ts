import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/store/useFilterStore";

export const useProducts = () => {

  const filters = useFilterStore((state) => state.filters);

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== "" && v !== undefined)
  );

  const page = useFilterStore((s) => s.page);

  return useQuery({
    queryKey: ["products", cleanFilters, page],
    queryFn: async () => {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query GetProducts($filter: ProductFilterInput, $page: Int) {
            products(filter: $filter, page: $page) {
              id
              title
              price
              image
            }
          }
        `,
          variables: {
            filter: cleanFilters,
            page,
          },
        }),
      });

      const json = await res.json();
      return json.data.products;
    },
  });
};