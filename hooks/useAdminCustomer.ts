import { useQuery } from "@tanstack/react-query";
import { ADMIN_CUSTOMER_DETAIL } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";
import { AdminCustomerDetail } from "@/types/customer";

export function useAdminCustomer(id: string | null) {
    return useQuery({
        queryKey: ["admin-customer", id],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminCustomer: AdminCustomerDetail | null;
            }>(ADMIN_CUSTOMER_DETAIL, { id });

            return data.adminCustomer;
        },
        enabled: Boolean(id),
    });
}
