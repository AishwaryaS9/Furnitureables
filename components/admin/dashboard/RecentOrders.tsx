"use client";

import { ShoppingBag, AlertCircle, ArrowUpRight, PackageOpen, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminRecentOrders } from "@/hooks/useAdminRecentOrders";
import { RecentOrderStatus } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

const STATUS_STYLES: Record<RecentOrderStatus, { dot: string; badge: string }> = {
    DELIVERED: {
        dot: "bg-emerald-500",
        badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    CONFIRMED: {
        dot: "bg-blue-500",
        badge: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    SHIPPED: {
        dot: "bg-amber-500",
        badge: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    PENDING: {
        dot: "bg-slate-400",
        badge: "border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-400",
    },
    CANCELLED: {
        dot: "bg-red-500",
        badge: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
    },
};

function toTitleCase(status: string) {
    return status.charAt(0) + status.slice(1).toLowerCase();
}


export default function RecentOrders() {
    const { data, isLoading, isError, refetch, isRefetching } = useAdminRecentOrders(5);

    const orders = data ?? [];
    const hasOrders = orders.length > 0;

    return (
        <Card
            className="rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl shadow-xs"
            role="region"
            aria-label="Recent Customer Orders"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 sm:p-6 pb-2 sm:pb-3">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-foreground"
                        aria-hidden="true"
                    >
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base sm:text-lg font-semibold text-foreground leading-tight">
                            Recent Orders
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Latest activity across your store
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {!isLoading && !isError && hasOrders && (
                        <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
                            {orders.length}
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs font-medium text-muted-foreground hover:text-foreground hidden sm:inline-flex"
                    >
                        View all
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-2 sm:pt-3">
                {isLoading ? (
                    <div className="space-y-4 py-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 py-2">
                                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-3.5 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full hidden md:block" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                                Couldn&apos;t load recent orders
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Check your connection and try again.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                            onClick={() => refetch()}
                            disabled={isRefetching}
                        >
                            <RotateCcw className={cn("h-3.5 w-3.5", isRefetching && "animate-spin")} />
                            {isRefetching ? "Retrying..." : "Retry"}
                        </Button>
                    </div>
                ) : !hasOrders ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                            <PackageOpen className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">No orders yet</p>
                            <p className="text-xs text-muted-foreground">
                                New orders will show up here as customers check out.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full overflow-x-auto">
                        <Table aria-label="List of recent customer orders">
                            <TableHeader>
                                <TableRow className="border-border/60 hover:bg-transparent">
                                    <TableHead className="py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                                        Order ID
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                                        Customer
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                                        Date
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                                        Status
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-right font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => {
                                    const date = dateFormatter.format(new Date(order.createdAt));
                                    const status = STATUS_STYLES[order.status];

                                    return (
                                        <TableRow
                                            key={order.id}
                                            className="border-border/40 transition-colors hover:bg-muted/40"
                                        >
                                            <TableCell className="py-4 px-4 font-mono text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                {order.orderNumber}
                                            </TableCell>
                                            <TableCell className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <div className="font-medium text-foreground text-sm leading-tight whitespace-nowrap">
                                                            {order.customerName}
                                                        </div>
                                                        <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                                            {date}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                                                {date}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell py-4 px-4 whitespace-nowrap">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "gap-1.5 font-semibold text-xs py-1 px-2.5",
                                                        status?.badge
                                                    )}
                                                >
                                                    <span
                                                        className={cn("h-1.5 w-1.5 rounded-full", status?.dot)}
                                                        aria-hidden="true"
                                                    />
                                                    {toTitleCase(order.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 px-4 text-right font-semibold text-sm text-foreground tabular-nums whitespace-nowrap">
                                                {currencyFormatter.format(order.total)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}