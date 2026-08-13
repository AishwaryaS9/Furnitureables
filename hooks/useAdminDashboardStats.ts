import { useQuery } from "@tanstack/react-query";
import { ADMIN_DASHBOARD_STATS } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";
import { DashboardStats } from "@/types/dashboard";

export function useAdminDashboardStats() {
    return useQuery({
        queryKey: ["admin-dashboard-stats"],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminDashboardStats: DashboardStats;
            }>(ADMIN_DASHBOARD_STATS);

            return data.adminDashboardStats;
        },
    });
}
