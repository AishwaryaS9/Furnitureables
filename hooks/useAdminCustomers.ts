import { useQuery } from "@tanstack/react-query";
import { ADMIN_CUSTOMERS } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";
import { AdminCustomer } from "@/types/customer";

export function useAdminCustomers() {
    return useQuery({
        queryKey: ["admin-customers"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminCustomers: AdminCustomer[];
            }>(ADMIN_CUSTOMERS);

            return data.adminCustomers;
        },
    });
}
