"use client";

import { CreditCard } from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAdminPaymentMethodDistribution } from "@/hooks/useAdminAnalytics";
import ChartCard from "./ChartCard";
import { PAYMENT_METHOD_COLORS, PAYMENT_METHOD_LABELS, tooltipStyle } from "@/lib/chart";

interface RadialPoint {
    method: string;
    count: number;
    revenue: number;
    label: string;
    fill: string;
}

function RadialTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: RadialPoint }[];
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div style={tooltipStyle()}>
            <p className="text-xs font-medium text-muted-foreground mb-1">{point.label}</p>
            <p className="text-sm font-semibold text-foreground">{point.count} orders</p>
        </div>
    );
}

export default function PaymentMethodChart() {
    const { data, isLoading, isError } = useAdminPaymentMethodDistribution();

    const points: RadialPoint[] = (data ?? []).map((p) => ({
        ...p,
        label: PAYMENT_METHOD_LABELS[p.method] ?? p.method,
        fill: PAYMENT_METHOD_COLORS[p.method] ?? "var(--chart-3)",
    }));
    const total = points.reduce((sum, p) => sum + p.count, 0);

    return (
        <ChartCard
            title="Payment Method Split"
            description="Orders grouped by how customers paid"
            icon={CreditCard}
            isLoading={isLoading}
            isError={isError}
            isEmpty={total === 0}
            emptyMessage="Payment method breakdown will appear once orders are placed."
        >
            <div className="w-full h-72 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-2/3 h-56 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            data={points}
                            innerRadius="28%"
                            outerRadius="100%"
                            startAngle={90}
                            endAngle={-270}
                        >
                            <Tooltip content={<RadialTooltip />} />
                            <RadialBar dataKey="count" background cornerRadius={8} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>

                <ul className="flex sm:flex-col flex-row flex-wrap gap-x-4 gap-y-2 justify-center">
                    {points.map((point) => (
                        <li key={point.method} className="flex items-center gap-2 text-xs">
                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: point.fill }}
                                aria-hidden="true"
                            />
                            <span className="text-muted-foreground font-medium">
                                {point.label}
                            </span>
                            <span className="text-foreground font-semibold">
                                {point.count}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </ChartCard>
    );
}
