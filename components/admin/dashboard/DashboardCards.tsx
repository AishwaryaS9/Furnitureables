"use client";

import { IndianRupee, Package, ShoppingCart, Users, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function DashboardCards() {
  const { data, isLoading, isError } = useAdminDashboardStats();

  const stats = [
    {
      title: "Total Revenue",
      value: data ? currencyFormatter.format(data.totalRevenue) : "₹0",
      icon: IndianRupee,
      description: "Total revenue earned",
      accent: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
      border: "border-border/60",
    },
    {
      title: "Orders",
      value: (data?.totalOrders ?? 0).toLocaleString("en-IN"),
      icon: ShoppingCart,
      description: "Completed and pending orders",
      accent: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
      border: "border-border/60",
    },
    {
      title: "Products",
      value: (data?.totalProducts ?? 0).toLocaleString("en-IN"),
      icon: Package,
      description: "Total catalog items available",
      accent: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
      border: "border-border/60",
    },
    {
      title: "Customers",
      value: (data?.totalCustomers ?? 0).toLocaleString("en-IN"),
      icon: Users,
      description: "Registered customer accounts",
      accent: "from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400",
      border: "border-border/60",
    },
  ];

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      role="region"
      aria-label="Summary KPI Cards"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-xl p-5 shadow-xs transition-all duration-300 hover:shadow-sm"
          >
            <CardContent className="p-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </span>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${stat.accent} shadow-inner`}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-28 rounded-lg" />
                ) : isError ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Unable to load</span>
                  </div>
                ) : (
                  <div
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                    aria-label={`${stat.title}: ${stat.value}`}
                  >
                    {stat.value}
                  </div>
                )}
                <p className="mt-1 text-xs text-muted-foreground font-medium">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}