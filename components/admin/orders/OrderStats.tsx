"use client";

import { ShoppingCart, Clock, PackageCheck, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/order";

interface Props {
    total: number;
    pending: number;
    delivered: number;
    revenue: number;
}

export default function OrderStats({ total, pending, delivered, revenue }: Props) {
    const stats = [
        {
            id: "stat-total-orders",
            title: "Total Orders",
            value: total.toLocaleString("en-IN"),
            ariaValue: `${total.toLocaleString("en-IN")} total orders`,
            icon: ShoppingCart,
            description: "All orders placed",
            accent: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
            border: "border-border/60",
        },
        {
            id: "stat-pending-orders",
            title: "Pending",
            value: pending.toLocaleString("en-IN"),
            ariaValue: `${pending.toLocaleString("en-IN")} pending orders`,
            icon: Clock,
            description: "Awaiting confirmation or shipment",
            accent: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
            border: pending > 0 ? "border-amber-500/30" : "border-border/60",
        },
        {
            id: "stat-delivered-orders",
            title: "Delivered",
            value: delivered.toLocaleString("en-IN"),
            ariaValue: `${delivered.toLocaleString("en-IN")} delivered orders`,
            icon: PackageCheck,
            description: "Successfully fulfilled orders",
            accent: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
            border: "border-border/60",
        },
        {
            id: "stat-total-revenue",
            title: "Total Revenue",
            value: formatCurrency(revenue),
            ariaValue: `${formatCurrency(revenue)} Indian Rupees total revenue`,
            icon: IndianRupee,
            description: "From non-cancelled orders",
            accent: "from-violet-500/20 to-purple-500/20 text-violet-600 dark:text-violet-400",
            border: "border-border/60",
        },
    ];

    return (
        <ul
            role="list"
            aria-label="Order summary metrics"
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0"
        >
            {stats.map((stat) => {
                const Icon = stat.icon;
                const descId = `${stat.id}-desc`;

                return (
                    <li key={stat.title} className="h-full list-none">
                        <Card
                            className="group relative h-full overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-xl p-5 shadow-xs transition-all duration-300 hover:shadow-sm"
                        // className="rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl shadow-xs transition-all hover:shadow-sm"
                        >
                            <CardContent className="p-0 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3
                                        id={stat.id}
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                    >
                                        {stat.title}
                                    </h3>
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${stat.accent} shadow-inner`}
                                        aria-hidden="true"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>

                                <div>
                                    <div
                                        className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                                        aria-labelledby={stat.id}
                                        aria-describedby={descId}
                                    >
                                        <span className="sr-only">{stat.ariaValue}</span>
                                        <span aria-hidden="true">{stat.value}</span>
                                    </div>
                                    <p
                                        id={descId}
                                        className="mt-1 text-xs text-muted-foreground font-medium"
                                    >
                                        {stat.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </li>
                );
            })}
        </ul>
    );
}