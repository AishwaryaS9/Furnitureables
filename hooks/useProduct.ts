import { useQuery } from "@tanstack/react-query";

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetProduct($id: String!) {
              product(id: $id) {
                id
                title
                description
                price
                image
                material
                color
                room
                dimensions
                stock
              }
            }
          `,
          variables: { id },
        }
        ),
      });

      const json = await res.json();
      return json.data.product;
    },
  });
};