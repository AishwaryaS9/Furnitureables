import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { ACTIVE_PROMOTION } from "@/lib/graphql/queries";

export function useActivePromotion() {
    return useQuery({
        queryKey: ["activePromotion"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                activePromotion: any | null;
            }>(ACTIVE_PROMOTION);

            return data.activePromotion;
        },

        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
        refetchOnWindowFocus: true,
    });
}