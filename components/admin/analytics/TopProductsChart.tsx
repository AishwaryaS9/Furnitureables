"use client";

import { Trophy } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAdminTopProducts } from "@/hooks/useAdminAnalytics";
import { TopProduct } from "@/types/analytics";
import ChartCard from "./ChartCard";
import { CHART_COLORS, compactCurrencyFormatter, currencyFormatter, tooltipStyle } from "@/lib/chart";

function TopProductsTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: TopProduct }[];
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div style={tooltipStyle()} role="tooltip" aria-hidden="true">
            <p className="text-xs font-medium text-muted-foreground mb-1 max-w-48 truncate">
                {point.title}
            </p>
            <p className="text-sm font-semibold text-foreground">
                {currencyFormatter.format(point.revenue)}
            </p>
            <p className="text-xs text-muted-foreground">{point.unitsSold} units sold</p>
        </div>
    );
}

export default function TopProductsChart() {
    const { data, isLoading, isError } = useAdminTopProducts(5);

    const points = [...(data ?? [])].sort((a, b) => a.revenue - b.revenue);
    const rankedPoints = [...(data ?? [])].sort((a, b) => b.revenue - a.revenue);
    const hasData = points.length > 0;

    return (
        <ChartCard
            title="Top Products by Revenue"
            description="Best-selling items in the current catalog"
            icon={Trophy}
            isLoading={isLoading}
            isError={isError}
            isEmpty={!hasData}
            emptyMessage="Top products will appear once orders start coming in."
        >
            <div className="sr-only">
                <table>
                    <caption>
                        Top Products by Revenue: Ranking of top-selling products by total revenue and units sold
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">Rank</th>
                            <th scope="col">Product Title</th>
                            <th scope="col">Revenue</th>
                            <th scope="col">Units Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankedPoints.map((entry, index) => (
                            <tr key={entry.id}>
                                <td>#{index + 1}</td>
                                <td>{entry.title}</td>
                                <td>{currencyFormatter.format(entry.revenue)}</td>
                                <td>{entry.unitsSold} units</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div
                className="w-full h-72"
                aria-hidden="true"
                role="img"
                aria-label="Horizontal bar chart ranking top-selling products by revenue"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={points}
                        layout="vertical"
                        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/60" />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            tickFormatter={(value) => compactCurrencyFormatter.format(value as number)}
                        />
                        <YAxis
                            type="category"
                            dataKey="title"
                            axisLine={false}
                            tickLine={false}
                            width={110}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            tickFormatter={(value: string) =>
                                value.length > 16 ? `${value.slice(0, 16)}…` : value
                            }
                        />
                        <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<TopProductsTooltip />} />
                        <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={24}>
                            {points.map((entry, index) => (
                                <Cell key={entry.id} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}