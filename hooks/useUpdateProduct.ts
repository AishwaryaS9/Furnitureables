import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UPDATE_PRODUCT } from "@/lib/graphql/mutations";
import { graphqlClient } from "@/lib/graphql/client";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: any;
    }) => {
      return graphqlClient.request(UPDATE_PRODUCT, {
        id,
        input,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });
}