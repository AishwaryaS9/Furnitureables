"use client";

import { Package, AlertTriangle, AlertCircle, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    total: number;
    lowStock: number;
    outOfStock: number;
    inventoryValue: number;
}

export default function ProductStats({ total, lowStock, outOfStock, inventoryValue }: Props) {
    const stats = [
        {
            title: "Total Products",
            value: total.toLocaleString("en-IN"),
            icon: Package,
            description: "Active catalog items",
            accent: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
            border: "border-border/60",
        },
        {
            title: "Low Stock",
            value: lowStock.toLocaleString("en-IN"),
            icon: AlertTriangle,
            description: "5 or fewer remaining",
            accent: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
            border: lowStock > 0 ? "border-amber-500/30" : "border-border/60",
        },
        {
            title: "Out of Stock",
            value: outOfStock.toLocaleString("en-IN"),
            icon: AlertCircle,
            description: "Needs immediate reorder",
            accent: "from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400",
            border: outOfStock > 0 ? "border-rose-500/30" : "border-border/60",
        },
        {
            title: "Inventory Value",
            value: `₹${inventoryValue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            description: "Total stock valuation",
            accent: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
            border: "border-border/60",
        },
    ];

    return (
        <div
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
            role="region"
            aria-label="Product Inventory Summary Metrics"
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
                                <div
                                    className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
                                    aria-label={`${stat.title}: ${stat.value}`}
                                >
                                    {stat.value}
                                </div>
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