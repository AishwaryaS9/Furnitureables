import { useQuery } from "@tanstack/react-query";
import { ADMIN_RECENT_ORDERS } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";
import { RecentOrder } from "@/types/dashboard";

export function useAdminRecentOrders(limit: number = 5) {
    return useQuery({
        queryKey: ["admin-recent-orders", limit],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminRecentOrders: RecentOrder[];
            }>(ADMIN_RECENT_ORDERS, { limit });

            return data.adminRecentOrders;
        },
    });
}
