import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UPDATE_PRODUCT } from "@/lib/graphql/mutations";
import { graphqlClient } from "@/lib/graphql/client";
import { Product, ProductFormData } from "@/types/product";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: ProductFormData;
    }) => {
      const cleanedInput = {
        title: input.title,
        description: input.description,
        price: input.price,
        stock: input.stock,
        type: input.type,
        material: input.material,
        color: input.color,
        room: input.room,
        dimensions: input.dimensions,
        sku: input.sku,

        media: input.media?.map((m) => ({
          url: m.url,
          type: m.type,
          sortOrder: m.sortOrder,
        })),
      };

      return graphqlClient.request<{
        product: Product;
      }>(UPDATE_PRODUCT, {
        id,
        input: cleanedInput,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });
}