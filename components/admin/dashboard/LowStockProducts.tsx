"use client";

import { CheckCircle2, AlertCircle, Package, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminLowStockProducts } from "@/hooks/useAdminLowStockProducts";

export default function LowStockProducts() {
    const { data, isLoading, isError } = useAdminLowStockProducts(10, 5);

    const products = data ?? [];
    const hasLowStock = products.length > 0;

    return (
        <Card
            className="group relative overflow-hidden rounded-2xlborder-border/60 bg-card/80  backdrop-blur-xl shadow-xs"
            role="region"
            aria-label="Low Stock Inventory Alerts"
        >
            {/* Top Accent Strip */}
            {hasLowStock && !isLoading && !isError && (
                <div className="absolute top-0 left-0 right-0 h-1" />
            )}

            {/* Header Section */}
            <CardHeader className="flex flex-row items-center justify-between space-y-1 p-4 pb-4">
                <div className="flex items-center gap-2.5">
                    <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${hasLowStock
                            ? "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20"
                            }`}
                        aria-hidden="true"
                    >
                        {hasLowStock ? (
                            <AlertTriangle className="h-4 w-4" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}
                    </div>
                    <div>
                        <CardTitle className="text-sm sm:text-base font-semibold tracking-tight text-foreground leading-tight">
                            Low Stock Alerts
                        </CardTitle>
                        <p className="text-[11px] text-muted-foreground">
                            Products requiring reorder
                        </p>
                    </div>
                </div>

                {!isLoading && !isError && hasLowStock && (
                    <Badge
                        variant="destructive"
                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-2xs"
                    >
                        {products.length} {products.length === 1 ? 'item' : 'items'}
                    </Badge>
                )}
            </CardHeader>

            {/* Content Area */}
            <CardContent className="p-4 pt-0">
                {/* 1. LOADING STATE */}
                {isLoading ? (
                    <div className="space-y-2" aria-busy="true">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-2 rounded-lg border border-border/30 bg-muted/20"
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <Skeleton className="h-6 w-6 rounded shrink-0" />
                                    <Skeleton className="h-3.5 w-3/4" />
                                </div>
                                <Skeleton className="h-5 w-14 rounded-full shrink-0 ml-2" />
                            </div>
                        ))}
                    </div>
                ) :

                    /* 2. ERROR STATE */
                    isError ? (
                        <div className="flex items-center gap-2.5 p-3 rounded-lg border border-dashed border-destructive/20 bg-destructive/5 text-destructive">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p className="text-xs font-medium">Unable to load inventory data.</p>
                        </div>
                    ) :

                        /* 3. HEALTHY INVENTORY STATE */
                        !hasLowStock ? (
                            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-dashed border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                <p className="text-xs font-medium">All products are sufficiently stocked.</p>
                            </div>
                        ) :

                            /* 4. COMPACT LOW STOCK PRODUCT LIST */
                            (
                                <ul className="space-y-4" role="list">
                                    {products.map((product) => {
                                        const isCritical = product.stock <= 2;

                                        return (
                                            <li
                                                key={product.id}
                                                className="group/item flex items-center justify-between p-2 rounded-lg border border-border/40 bg-background/60 hover:bg-muted/40 transition-colors"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted/80 text-muted-foreground group-hover/item:text-foreground transition-colors">
                                                        <Package className="h-3.5 w-3.5" />
                                                    </div>
                                                    <div className="min-w-0 flex-1 flex items-center gap-2">
                                                        <p className="text-xs font-medium text-foreground truncate group-hover/item:text-primary transition-colors">
                                                            {product.title}
                                                        </p>
                                                        <span className="text-[10px] text-muted-foreground/80 font-mono shrink-0 hidden sm:inline">
                                                            ({product.sku})
                                                        </span>
                                                    </div>
                                                </div>

                                                <Badge
                                                    variant="outline"
                                                    className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isCritical
                                                        ? "border-destructive/40 bg-destructive/15 text-destructive"
                                                        : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                        }`}
                                                >
                                                    {product.stock} left
                                                </Badge>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
            </CardContent>
        </Card>
    );
}