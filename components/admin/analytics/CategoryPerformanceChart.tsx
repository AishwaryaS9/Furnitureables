"use client";

import { Radar as RadarIcon } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAdminCategoryPerformance } from "@/hooks/useAdminAnalytics";
import { CategoryPerformance } from "@/types/analytics";
import ChartCard from "./ChartCard";
import { currencyFormatter, tooltipStyle } from "@/lib/chart";

function CategoryTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: CategoryPerformance }[];
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div style={tooltipStyle()} role="tooltip" aria-hidden="true">
            <p className="text-xs font-medium text-muted-foreground mb-1">{point.category}</p>
            <p className="text-sm font-semibold text-foreground">
                {currencyFormatter.format(point.revenue)}
            </p>
            <p className="text-xs text-muted-foreground">{point.orders} orders</p>
        </div>
    );
}

export default function CategoryPerformanceChart() {
    const { data, isLoading, isError } = useAdminCategoryPerformance();

    const points = data ?? [];
    const hasData = points.length > 0;

    return (
        <ChartCard
            title="Category Performance"
            description="Revenue contribution by room category"
            icon={RadarIcon}
            isLoading={isLoading}
            isError={isError}
            isEmpty={!hasData}
            emptyMessage="Category performance will appear once orders start coming in."
        >
            <div className="sr-only">
                <table>
                    <caption>Category Performance: Revenue and Order breakdown by room category</caption>
                    <thead>
                        <tr>
                            <th scope="col">Category</th>
                            <th scope="col">Revenue</th>
                            <th scope="col">Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {points.map((point) => (
                            <tr key={point.category}>
                                <td>{point.category}</td>
                                <td>{currencyFormatter.format(point.revenue)}</td>
                                <td>{point.orders} orders</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div
                className="w-full h-72"
                aria-hidden="true"
                role="img"
                aria-label="Radar chart illustrating revenue contribution by room category"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={points} outerRadius="75%">
                        <PolarGrid className="stroke-border/60" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        />
                        <PolarRadiusAxis
                            tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                            axisLine={false}
                        />
                        <Tooltip content={<CategoryTooltip />} />
                        <Radar
                            dataKey="revenue"
                            stroke="#D97706"
                            fill="#D97706"
                            fillOpacity={0.35}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}