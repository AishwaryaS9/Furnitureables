"use client";

import { MessageSquare, Clock3, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewCounts } from "@/types/review";

interface ReviewStatsProps {
    counts: ReviewCounts;
}

export default function ReviewStats({ counts }: ReviewStatsProps) {
    const stats = [
        {
            id: "stat-all-reviews",
            title: "All Reviews",
            value: counts.all.toLocaleString("en-IN"),
            ariaValue: `${counts.all.toLocaleString("en-IN")} total submitted reviews`,
            icon: MessageSquare,
            description: "Total submitted reviews",
            accent: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
            border: "border-border/60",
        },
        {
            id: "stat-pending-reviews",
            title: "Pending",
            value: counts.pending.toLocaleString("en-IN"),
            ariaValue: `${counts.pending.toLocaleString("en-IN")} pending reviews awaiting moderation`,
            icon: Clock3,
            description: "Awaiting moderation",
            accent: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
            border: counts.pending > 0 ? "border-amber-500/30" : "border-border/60",
        },
        {
            id: "stat-approved-reviews",
            title: "Approved",
            value: counts.approved.toLocaleString("en-IN"),
            ariaValue: `${counts.approved.toLocaleString("en-IN")} approved reviews live on store`,
            icon: CheckCircle2,
            description: "Live on product pages",
            accent: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
            border: "border-border/60",
        },
        {
            id: "stat-rejected-reviews",
            title: "Rejected",
            value: counts.rejected.toLocaleString("en-IN"),
            ariaValue: `${counts.rejected.toLocaleString("en-IN")} rejected reviews hidden from store`,
            icon: XCircle,
            description: "Hidden from store",
            accent: "from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400",
            border: "border-border/60",
        },
    ];

    return (
        <ul
            role="list"
            aria-label="Customer review summary metrics"
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0"
        >
            {stats.map((stat) => {
                const Icon = stat.icon;
                const descId = `${stat.id}-desc`;

                return (
                    <li key={stat.id} className="h-full list-none">
                        <Card
                            className="group relative h-full overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-xl p-5 shadow-xs transition-all duration-300 hover:shadow-sm"
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