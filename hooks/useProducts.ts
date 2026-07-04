import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/store/useFilterStore";

export const useProducts = () => {

const filters = useFilterStore((state) => state.filters);

const cleanFilters = Object.fromEntries(
  Object.entries(filters).filter(([_, v]) => v !== "" && v !== undefined)
);

return useQuery({
  queryKey: ["products", cleanFilters],
  queryFn: async () => {
    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetProducts($filter: ProductFilterInput) {
            products(filter: $filter) {
              id
              title
              price
              image
            }
          }
        `,
        variables: {
          filter: cleanFilters,
        },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      console.error(json.errors);
      throw new Error("GraphQL Error");
    }

    return json.data.products;
  },
});
};