"use client";

import { IndianRupee, Package, ShoppingCart, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    },
    {
      title: "Orders",
      value: (data?.totalOrders ?? 0).toLocaleString("en-IN"),
      icon: ShoppingCart,
      description: "Total completed and pending orders",
    },
    {
      title: "Products",
      value: (data?.totalProducts ?? 0).toLocaleString("en-IN"),
      icon: Package,
      description: "Total catalog items available",
    },
    {
      title: "Customers",
      value: (data?.totalCustomers ?? 0).toLocaleString("en-IN"),
      icon: Users,
      description: "Total registered customer accounts",
    },
  ];

  return (
    <div
      className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      role="region"
      aria-label="Summary KPI Cards"
    >
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl shadow-xs transition-all hover:shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-5">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-foreground"
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : isError ? (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Unable to load</span>
                </div>
              ) : (
                <div
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                  aria-label={`${item.title}: ${item.value}`}
                >
                  {item.value}
                </div>
              )}
              <p className="sr-only">{item.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
