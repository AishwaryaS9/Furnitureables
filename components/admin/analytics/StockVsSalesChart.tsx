"use client";

import { Boxes } from "lucide-react";
import {
    CartesianGrid,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
} from "recharts";
import { useAdminStockVsSales } from "@/hooks/useAdminAnalytics";
import { StockVsSalesPoint } from "@/types/analytics";
import ChartCard from "./ChartCard";
import { tooltipStyle } from "@/lib/chart";

function StockTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: StockVsSalesPoint }[];
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div style={tooltipStyle()}>
            <p className="text-xs font-medium text-muted-foreground mb-1 max-w-48 truncate">
                {point.title}
            </p>
            <p className="text-sm font-semibold text-foreground">{point.stock} in stock</p>
            <p className="text-xs text-muted-foreground">{point.unitsSold} units sold</p>
        </div>
    );
}

export default function StockVsSalesChart() {
    const { data, isLoading, isError } = useAdminStockVsSales(20);

    const points = data ?? [];
    const hasData = points.length > 0;

    return (
        <ChartCard
            title="Stock vs Units Sold"
            description="Inventory levels against sales performance"
            icon={Boxes}
            isLoading={isLoading}
            isError={isError}
            isEmpty={!hasData}
            emptyMessage="This chart will populate once the catalog has products and sales."
        >
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                        <XAxis
                            type="number"
                            dataKey="stock"
                            name="Stock"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            label={{
                                value: "Stock on hand",
                                position: "insideBottom",
                                offset: -4,
                                fontSize: 11,
                                fill: "var(--muted-foreground)",
                            }}
                        />
                        <YAxis
                            type="number"
                            dataKey="unitsSold"
                            name="Units sold"
                            axisLine={false}
                            tickLine={false}
                            width={36}
                            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        />
                        <ZAxis range={[80, 80]} />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<StockTooltip />} />
                        <Scatter data={points} fill="var(--accent)" fillOpacity={0.75} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}
