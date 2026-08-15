"use client";

import { ShoppingBag, AlertCircle, ArrowUpRight, PackageOpen, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminRecentOrders } from "@/hooks/useAdminRecentOrders";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatCurrency, formatOrderDate } from "@/lib/order";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

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
                <div className="flex items-center gap-2">
                    <Link href="/admin/orders" tabIndex={-1} className="focus:outline-none">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 rounded-xl gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                            aria-label="View all orders"
                        >
                            View all
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                    </Link>
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
                                    const date = formatOrderDate(order.createdAt)
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
                                                <OrderStatusBadge status={order.status} />
                                            </TableCell>
                                            <TableCell className="py-4 px-4 text-right font-semibold text-sm text-foreground tabular-nums whitespace-nowrap">
                                                {formatCurrency(order.total)}
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