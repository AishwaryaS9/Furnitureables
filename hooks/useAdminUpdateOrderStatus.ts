import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { ADMIN_UPDATE_ORDER_STATUS } from "@/lib/graphql/mutations";
import { AdminOrder, OrderStatus } from "@/types/order";

interface Variables {
    id: string;
    status: OrderStatus;
}

export function useAdminUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: Variables) => {
            return graphqlClient.request<{
                adminUpdateOrderStatus: AdminOrder;
            }>(ADMIN_UPDATE_ORDER_STATUS, { id, status });
        },

        // Optimistically update the table so the badge/select reflects
        // the new status immediately, without waiting on the network.
        onMutate: async ({ id, status }: Variables) => {
            await queryClient.cancelQueries({ queryKey: ["admin-orders"] });

            const previousOrders = queryClient.getQueryData<AdminOrder[]>([
                "admin-orders",
            ]);

            queryClient.setQueryData<AdminOrder[]>(
                ["admin-orders"],
                (old) =>
                    old?.map((order) =>
                        order.id === id ? { ...order, status } : order
                    )
            );

            return { previousOrders };
        },

        onError: (_err, _variables, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(
                    ["admin-orders"],
                    context.previousOrders
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        },
    });
}
