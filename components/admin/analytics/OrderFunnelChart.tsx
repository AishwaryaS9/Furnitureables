"use client";

import { Filter } from "lucide-react";
import { Cell, Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip } from "recharts";
import { useAdminOrderFunnel } from "@/hooks/useAdminAnalytics";
import { OrderFunnelStage } from "@/types/analytics";
import ChartCard from "./ChartCard";
import { tooltipStyle } from "@/lib/chart";

const STAGE_COLORS = ["#D97706", "var(--accent)", "var(--chart-2)", "var(--success)"];

function FunnelTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: OrderFunnelStage }[];
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div style={tooltipStyle()}>
            <p className="text-xs font-medium text-muted-foreground mb-1">{point.stage}</p>
            <p className="text-sm font-semibold text-foreground">{point.count} orders</p>
        </div>
    );
}

export default function OrderFunnelChart() {
    const { data, isLoading, isError } = useAdminOrderFunnel();

    const points = data ?? [];
    const hasData = points.some((p) => p.count > 0);

    return (
        <ChartCard
            title="Order Fulfillment Funnel"
            description="How orders progress from placed to delivered"
            icon={Filter}
            isLoading={isLoading}
            isError={isError}
            isEmpty={!hasData}
            emptyMessage="The fulfillment funnel will appear once orders start coming in."
        >
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart margin={{ top: 10, right: 80, bottom: 10, left: 20 }}>
                        <Tooltip content={<FunnelTooltip />} />
                        <Funnel
                            dataKey="count"
                            nameKey="stage"
                            data={points}
                            isAnimationActive
                        >
                            <LabelList
                                position="right"
                                dataKey="stage"
                                fill="var(--foreground)"
                                fontSize={12}
                                stroke="none"
                            />
                            <LabelList
                                position="center"
                                dataKey="count"
                                fill="var(--primary-foreground)"
                                fontSize={12}
                                fontWeight={600}
                                stroke="none"
                            />
                            {points.map((entry, index) => (
                                <Cell key={entry.stage} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
                            ))}
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}
