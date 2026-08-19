"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useAdminRevenueTrend } from "@/hooks/useAdminAnalytics";
import { RevenueTrendPoint } from "@/types/analytics";
import ChartCard from "./ChartCard";
import { compactCurrencyFormatter, currencyFormatter, tooltipStyle } from "@/lib/chart";

const RANGE_OPTIONS = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
];

function RevenueTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: RevenueTrendPoint }[];
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div style={tooltipStyle()} role="tooltip" aria-hidden="true">
            <p className="text-xs font-medium text-muted-foreground mb-1">{point.date}</p>
            <p className="text-sm font-semibold text-foreground">
                {currencyFormatter.format(point.revenue)}
            </p>
            <p className="text-xs text-muted-foreground">{point.orders} orders</p>
        </div>
    );
}

export default function RevenueTrendChart() {
    const [days, setDays] = useState("30");
    const { data, isLoading, isError } = useAdminRevenueTrend(Number(days));

    const points = data ?? [];
    const hasData = points.some((p) => p.revenue > 0 || p.orders > 0);
    const selectedRangeLabel = RANGE_OPTIONS.find((o) => o.value === days)?.label ?? `${days} days`;

    return (
        <ChartCard
            title="Revenue & Orders Trend"
            description="Daily revenue and order volume"
            icon={Activity}
            isLoading={isLoading}
            isError={isError}
            isEmpty={!hasData}
            emptyMessage="Revenue and order trends will appear here once orders start coming in."
            chartHeightClassName="h-72"
            action={
                <Select
                    value={days}
                    onValueChange={(value) => {
                        if (value) setDays(value);
                    }}
                >
                    <SelectTrigger
                        aria-label="Select date range for revenue and order trend chart"
                        className="h-8 w-auto rounded-lg border-border/60 bg-background/60 text-xs font-medium px-2.5"
                    >
                        <span>{selectedRangeLabel}</span>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {RANGE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            }
        >
            <div className="sr-only">
                <table>
                    <caption>
                        Revenue and Orders Trend data table for {selectedRangeLabel}: daily revenue and order volume
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Revenue</th>
                            <th scope="col">Order Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {points.map((point) => (
                            <tr key={point.date}>
                                <td>{point.date}</td>
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
                aria-label={`Composed bar and line chart showing daily revenue and orders trend over ${selectedRangeLabel}`}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            interval="preserveStartEnd"
                            minTickGap={24}
                        />
                        <YAxis
                            yAxisId="revenue"
                            axisLine={false}
                            tickLine={false}
                            width={48}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            tickFormatter={(value) => compactCurrencyFormatter.format(value as number)}
                        />
                        <YAxis
                            yAxisId="orders"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            width={32}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            allowDecimals={false}
                        />
                        <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<RevenueTooltip />} />
                        <Bar
                            yAxisId="revenue"
                            dataKey="revenue"
                            fill="#D97706"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={28}
                            name="Revenue"
                        />
                        <Line
                            yAxisId="orders"
                            type="monotone"
                            dataKey="orders"
                            stroke="var(--accent)"
                            strokeWidth={2}
                            dot={false}
                            name="Orders"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}