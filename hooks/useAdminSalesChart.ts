import { useQuery } from "@tanstack/react-query";
import { ADMIN_SALES_CHART } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql/client";
import { SalesChartPoint } from "@/types/dashboard";

export function useAdminSalesChart(months: number = 6) {
    return useQuery({
        queryKey: ["admin-sales-chart", months],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                adminSalesChart: SalesChartPoint[];
            }>(ADMIN_SALES_CHART, { months });

            return data.adminSalesChart;
        },
    });
}
