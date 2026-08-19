"use client";

import { Star } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useAdminRatingDistribution } from "@/hooks/useAdminAnalytics";
import { RatingDistributionSlice } from "@/types/analytics";
import ChartCard from "./ChartCard";
import { tooltipStyle } from "@/lib/chart";

const RATING_COLORS: Record<number, string> = {
    1: "var(--destructive)",
    2: "var(--chart-2)",
    3: "#D97706",
    4: "var(--accent)",
    5: "var(--success)",
};

function RatingTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: RatingDistributionSlice }[];
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div style={tooltipStyle()} role="tooltip" aria-hidden="true">
            <p className="text-xs font-medium text-muted-foreground mb-1">
                {point.rating} star{point.rating === 1 ? "" : "s"}
            </p>
            <p className="text-sm font-semibold text-foreground">{point.count} reviews</p>
        </div>
    );
}

export default function RatingDistributionChart() {
    const { data, isLoading, isError } = useAdminRatingDistribution();

    const points = (data ?? []).map((p) => ({
        ...p,
        label: `${p.rating}★`,
    }));
    const hasData = points.some((p) => p.count > 0);
    const totalReviews = points.reduce((sum, p) => sum + p.count, 0);

    return (
        <ChartCard
            title="Review Rating Distribution"
            description="Approved customer reviews by star rating"
            icon={Star}
            isLoading={isLoading}
            isError={isError}
            isEmpty={!hasData}
            emptyMessage="Rating distribution will appear once customers leave approved reviews."
        >
            <div className="sr-only">
                <table>
                    <caption>Customer Review Rating Distribution: Breakdown of approved reviews by star rating</caption>
                    <thead>
                        <tr>
                            <th scope="col">Rating</th>
                            <th scope="col">Review Count</th>
                            <th scope="col">Share of Reviews</th>
                        </tr>
                    </thead>
                    <tbody>
                        {points.map((entry) => {
                            const percentage = totalReviews > 0 ? ((entry.count / totalReviews) * 100).toFixed(1) : "0";
                            return (
                                <tr key={entry.rating}>
                                    <td>{entry.rating} star{entry.rating === 1 ? "" : "s"}</td>
                                    <td>{entry.count} reviews</td>
                                    <td>{percentage}%</td>
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
                aria-label="Bar chart showing distribution of customer reviews from 1 to 5 stars"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={32}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            allowDecimals={false}
                        />
                        <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<RatingTooltip />} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                            {points.map((entry) => (
                                <Cell key={entry.rating} fill={RATING_COLORS[entry.rating] ?? "var(--chart-3)"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}