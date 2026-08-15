"use client";

import { Users, UserPlus, ShoppingBag, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/order";

interface Props {
    total: number;
    newThisMonth: number;
    repeatCustomers: number;
    totalRevenue: number;
}

export default function CustomerStats({ total, newThisMonth, repeatCustomers, totalRevenue }: Props) {
    const stats = [
        {
            id: "stat-total-customers",
            title: "Total Customers",
            value: total.toLocaleString("en-IN"),
            ariaValue: `${total.toLocaleString("en-IN")} total customers`,
            icon: Users,
            description: "All registered customers",
            accent: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
        },
        {
            id: "stat-new-customers",
            title: "New This Month",
            value: newThisMonth.toLocaleString("en-IN"),
            ariaValue: `${newThisMonth.toLocaleString("en-IN")} new customers this month`,
            icon: UserPlus,
            description: "Joined in the current month",
            accent: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
        },
        {
            id: "stat-repeat-customers",
            title: "Repeat Customers",
            value: repeatCustomers.toLocaleString("en-IN"),
            ariaValue: `${repeatCustomers.toLocaleString("en-IN")} repeat customers`,
            icon: ShoppingBag,
            description: "Placed more than one order",
            accent: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
        },
        {
            id: "stat-customer-revenue",
            title: "Total Revenue",
            value: formatCurrency(totalRevenue),
            ariaValue: `${formatCurrency(totalRevenue)} Indian Rupees total revenue from customers`,
            icon: IndianRupee,
            description: "From non-cancelled orders",
            accent: "from-violet-500/20 to-purple-500/20 text-violet-600 dark:text-violet-400",
        },
    ];

    return (
        <ul
            role="list"
            aria-label="Customer summary metrics"
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0"
        >
            {stats.map((stat) => {
                const Icon = stat.icon;
                const descId = `${stat.id}-desc`;

                return (
                    <li key={stat.id} className="h-full list-none">
                        <Card className="group relative h-full overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-xl p-5 shadow-xs transition-all duration-300 hover:shadow-sm">
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
