"use client";

import { LayoutGrid } from "lucide-react";
import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import { useAdminCategoryRevenueShare } from "@/hooks/useAdminAnalytics";
import { CategoryRevenueShare } from "@/types/analytics";
import ChartCard from "./ChartCard";
import { CHART_COLORS, currencyFormatter, tooltipStyle } from "@/lib/chart";

interface TreemapContentProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    name?: string;
    index?: number;
}

function TreemapCell({ x = 0, y = 0, width = 0, height = 0, name, index = 0 }: TreemapContentProps) {
    const fill = CHART_COLORS[index % CHART_COLORS.length];
    const canShowLabel = width > 60 && height > 32;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{ fill, stroke: "var(--card)", strokeWidth: 2 }}
                rx={8}
            />
            {canShowLabel && (
                <text
                    x={x + 8}
                    y={y + 18}
                    fontSize={11}
                    fontWeight={600}
                    fill="var(--primary-foreground)"
                >
                    {name}
                </text>
            )}
        </g>
    );
}

function RevenueShareTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: CategoryRevenueShare }[];
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div style={tooltipStyle()} role="tooltip" aria-hidden="true">
            <p className="text-xs font-medium text-muted-foreground mb-1">{point.name}</p>
            <p className="text-sm font-semibold text-foreground">
                {currencyFormatter.format(point.value)}
            </p>
        </div>
    );
}

type TreemapDatum = CategoryRevenueShare & Record<string, unknown>;

export default function RevenueByCategoryChart() {
    const { data, isLoading, isError } = useAdminCategoryRevenueShare();

    const points = (data ?? []) as unknown as TreemapDatum[];
    const hasData = points.length > 0;
    const totalRevenue = points.reduce((sum, p) => sum + (Number(p.value) || 0), 0);

    return (
        <ChartCard
            title="Revenue Share by Category"
            description="Where revenue is concentrated across product types"
            icon={LayoutGrid}
            isLoading={isLoading}
            isError={isError}
            isEmpty={!hasData}
            emptyMessage="Revenue share will appear once orders start coming in."
        >
            <div className="sr-only">
                <table>
                    <caption>Revenue Share by Category: Concentration of sales across product categories</caption>
                    <thead>
                        <tr>
                            <th scope="col">Category</th>
                            <th scope="col">Revenue</th>
                            <th scope="col">Share</th>
                        </tr>
                    </thead>
                    <tbody>
                        {points.map((point) => {
                            const val = Number(point.value) || 0;
                            const share = totalRevenue > 0 ? ((val / totalRevenue) * 100).toFixed(1) : "0";
                            return (
                                <tr key={point.name}>
                                    <td>{point.name}</td>
                                    <td>{currencyFormatter.format(val)}</td>
                                    <td>{share}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div
                className="w-full h-72"
                aria-hidden="true"
                role="img"
                aria-label="Treemap visualization showing revenue concentration by product category"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={points}
                        dataKey="value"
                        nameKey="name"
                        stroke="var(--card)"
                        content={<TreemapCell />}
                    >
                        <Tooltip content={<RevenueShareTooltip />} />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}