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
        <div style={tooltipStyle()}>
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
            <div className="w-full h-72">
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
