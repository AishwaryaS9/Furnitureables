"use client";

import { Users } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useAdminCustomerGrowth } from "@/hooks/useAdminAnalytics";
import { CustomerGrowthPoint } from "@/types/analytics";
import ChartCard from "./ChartCard";
import { tooltipStyle } from "@/lib/chart";

function GrowthTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: CustomerGrowthPoint }[];
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div style={tooltipStyle()}>
            <p className="text-xs font-medium text-muted-foreground mb-1">{point.date}</p>
            <p className="text-sm font-semibold text-foreground">
                {point.totalCustomers.toLocaleString("en-IN")} total
            </p>
            <p className="text-xs text-muted-foreground">+{point.newCustomers} new</p>
        </div>
    );
}

export default function CustomerGrowthChart() {
    const { data, isLoading, isError } = useAdminCustomerGrowth(6);

    const points = data ?? [];
    const hasData = points.some((p) => p.totalCustomers > 0);

    return (
        <ChartCard
            title="Customer Growth"
            description="Cumulative registered customers, last 6 months"
            icon={Users}
            isLoading={isLoading}
            isError={isError}
            isEmpty={!hasData}
            emptyMessage="Customer growth will appear here once accounts are created."
        >
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="customerGrowthFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={36}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            allowDecimals={false}
                        />
                        <Tooltip content={<GrowthTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="totalCustomers"
                            stroke="var(--accent)"
                            strokeWidth={2}
                            fill="url(#customerGrowthFill)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}
