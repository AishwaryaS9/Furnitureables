"use client";

import { TrendingUp, BarChart3, AlertCircle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSalesChart } from "@/hooks/useAdminSalesChart";
import { SalesChartPoint } from "@/types/dashboard";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: SalesChartPoint }[];
}) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-border/60 bg-popover px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-muted-foreground">{point.date}</p>
      <p className="text-sm font-semibold text-foreground">
        {currencyFormatter.format(point.revenue)}
      </p>
    </div>
  );
}

export default function SalesChart() {
  const { data, isLoading, isError } = useAdminSalesChart(6);

  const points = data ?? [];
  const hasData = points.some((point) => point.revenue > 0);

  return (
    <Card
      className="rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl shadow-xs min-h-87.5 flex flex-col"
      role="region"
      aria-label="Sales Analytics Chart"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 sm:p-6 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            Sales Overview
          </CardTitle>
          <p className="text-xs text-muted-foreground font-medium">
            Monthly revenue over the last {points.length || 6} months
          </p>
        </div>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-foreground"
          aria-hidden="true"
        >
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 flex-1 flex flex-col justify-center items-center">
        {isLoading ? (
          <Skeleton className="h-55 w-full rounded-xl" />
        ) : isError ? (
          <div
            className="flex flex-col items-center justify-center text-center py-10 space-y-3"
            aria-live="polite"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
              aria-hidden="true"
            >
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Unable to load sales data.
            </p>
          </div>
        ) : !hasData ? (
          <div
            className="flex flex-col items-center justify-center text-center py-10 space-y-3"
            aria-live="polite"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground/80"
              aria-hidden="true"
            >
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                No sales yet.
              </p>
              <p className="text-xs text-muted-foreground/70 max-w-xs">
                Sales visualization metrics will appear here once transactional data is accumulated.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-55">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={points}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/60"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) =>
                    compactCurrencyFormatter.format(value as number)
                  }
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  content={<ChartTooltip />}
                />
                <Bar
                  dataKey="revenue"
                  fill="#D97706"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
