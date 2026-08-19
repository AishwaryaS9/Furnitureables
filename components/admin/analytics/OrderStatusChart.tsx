"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAdminOrderStatusDistribution } from "@/hooks/useAdminAnalytics";
import ChartCard from "./ChartCard";
import { ORDER_STATUS_COLORS, tooltipStyle } from "@/lib/chart";

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

export default function OrderStatusChart() {
    const { data, isLoading, isError } = useAdminOrderStatusDistribution();

    const points = data ?? [];
    const total = points.reduce((sum, p) => sum + p.count, 0);

    return (
        <ChartCard
            title="Order Status Distribution"
            description="Share of orders by current status"
            icon={PieChartIcon}
            isLoading={isLoading}
            isError={isError}
            isEmpty={total === 0}
            emptyMessage="Order status breakdown will appear once orders are placed."
        >
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            contentStyle={tooltipStyle()}
                            formatter={(value, name) => [
                                `${value} orders`,
                                STATUS_LABELS[String(name)] ?? String(name),
                            ]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value: string) => (
                                <span className="text-xs text-muted-foreground">
                                    {STATUS_LABELS[value] ?? value}
                                </span>
                            )}
                        />
                        <Pie
                            data={points}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={2}
                            strokeWidth={2}
                            stroke="var(--card)"
                        >
                            {points.map((entry) => (
                                <Cell
                                    key={entry.status}
                                    fill={ORDER_STATUS_COLORS[entry.status] ?? "var(--chart-3)"}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}
