import { TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesChartProps {
  data?: Array<{ date: string; revenue: number }>;
}

export default function SalesChart({ data = [] }: SalesChartProps) {
  const hasData = data.length > 0;

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
            Monthly revenue and performance metrics
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
        {!hasData ? (
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
                Chart coming soon...
              </p>
              <p className="text-xs text-muted-foreground/70 max-w-xs">
                Sales visualization metrics will appear here once transactional data is accumulated.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="sr-only">Sales performance data visualizer</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}