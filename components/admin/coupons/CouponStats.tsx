"use client";

import { Ticket, CheckCircle2, Megaphone, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    total: number;
    active: number;
    promotional: number;
    newUserOnly: number;
}

export default function CouponStats({ total, active, promotional, newUserOnly }: Props) {
    const stats = [
        {
            id: "stat-total-coupons",
            title: "Total Coupons",
            value: total.toLocaleString("en-IN"),
            ariaValue: `${total.toLocaleString("en-IN")} total coupons`,
            icon: Ticket,
            description: "All coupons ever created",
            accent: "from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-400",
        },
        {
            id: "stat-active-coupons",
            title: "Active",
            value: active.toLocaleString("en-IN"),
            ariaValue: `${active.toLocaleString("en-IN")} active coupons`,
            icon: CheckCircle2,
            description: "Live, unexpired, and redeemable",
            accent: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
        },
        {
            id: "stat-promotional-coupons",
            title: "Navbar Promotions",
            value: promotional.toLocaleString("en-IN"),
            ariaValue: `${promotional.toLocaleString("en-IN")} coupons shown as navbar promotions`,
            icon: Megaphone,
            description: "Announced in the storefront navbar",
            accent: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
        },
        {
            id: "stat-new-user-coupons",
            title: "New User Offers",
            value: newUserOnly.toLocaleString("en-IN"),
            ariaValue: `${newUserOnly.toLocaleString("en-IN")} coupons for new users only`,
            icon: UserPlus,
            description: "Restricted to first-time customers",
            accent: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400",
        },
    ];

    return (
        <ul
            role="list"
            aria-label="Coupon summary metrics"
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