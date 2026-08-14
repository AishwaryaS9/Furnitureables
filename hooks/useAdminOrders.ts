import { useQuery } from "@tanstack/react-query";
import { ADMIN_ORDERS } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";
import { AdminOrder } from "@/types/order";

export function useAdminOrders() {
    return useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminOrders: AdminOrder[];
            }>(ADMIN_ORDERS);

            return data.adminOrders;
        },
    });
}
