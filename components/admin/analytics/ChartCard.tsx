"use client";

import { ReactNode, useId } from "react";
import { AlertCircle, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    emptyIcon?: LucideIcon;
    emptyTitle?: string;
    emptyMessage?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    chartHeightClassName?: string;
}

export default function ChartCard({
    title,
    description,
    icon: Icon,
    isLoading,
    isError,
    isEmpty,
    emptyIcon: EmptyIcon,
    emptyTitle = "No data yet.",
    emptyMessage = "This chart will populate once there is enough activity.",
    action,
    children,
    className,
    chartHeightClassName = "h-72",
}: ChartCardProps) {
    const titleId = useId();
    const descriptionId = useId();

    return (
        <Card
            className={`rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl shadow-xs min-h-88 flex flex-col ${className ?? ""}`}
            role="region"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            aria-busy={isLoading}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 sm:p-6 pb-4 gap-3">
                <div className="space-y-1 min-w-0">
                    <CardTitle
                        id={titleId}
                        className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 truncate"
                    >
                        {title}
                    </CardTitle>
                    <p
                        id={descriptionId}
                        className="text-xs text-muted-foreground font-medium"
                    >
                        {description}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {action}
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-foreground"
                        aria-hidden="true"
                    >
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 flex-1 flex flex-col justify-center items-center">
                {isLoading ? (
                    <div className="w-full" aria-hidden="true">
                        <Skeleton className={`w-full rounded-xl ${chartHeightClassName}`} />
                    </div>
                ) : isError ? (
                    <div
                        role="alert"
                        aria-live="assertive"
                        className="flex flex-col items-center justify-center text-center py-10 space-y-3"
                    >
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
                            aria-hidden="true"
                        >
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Unable to load this chart.
                        </p>
                    </div>
                ) : isEmpty ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className="flex flex-col items-center justify-center text-center py-10 space-y-3"
                    >
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground/80"
                            aria-hidden="true"
                        >
                            {EmptyIcon ? <EmptyIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                {emptyTitle}
                            </p>
                            <p className="text-xs text-muted-foreground/70 max-w-xs">
                                {emptyMessage}
                            </p>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
}