import { CheckCircle2, XCircle } from "lucide-react";
import { Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatStepTime, getStepTimestamp, STATUS_LABELS, statusIndex, steps } from "@/lib/order";

interface Props {
    order: Order;
}

export default function OrderTimeline({ order }: Props) {
    if (order.status === "CANCELLED") {
        return (
            <Card className="rounded-2xl border-destructive/30 bg-destructive/5 shadow-2xs">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-foreground">
                        Order Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3.5 text-destructive">
                        <XCircle className="h-6 w-6 shrink-0" aria-hidden="true" />
                        <div>
                            <p className="font-semibold text-sm">Order Cancelled</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                This order has been cancelled and will not be processed further.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const current = statusIndex[order.status];
    const isFullyDelivered = order.status === "DELIVERED";

    return (
        <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
            <CardHeader className="pb-4 sm:pb-6">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                        Order Status
                    </CardTitle>

                    <div
                        aria-hidden="true"
                        className="flex items-center gap-3 text-[11px] text-muted-foreground"
                    >
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-4 w-0 border-l-2 border-dashed border-emerald-500 dark:border-emerald-400" />
                            Completed
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-4 w-0 border-l-2 border-dotted border-border" />
                            Upcoming
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <p className="sr-only" role="status">
                    Current status: {STATUS_LABELS[order.status]}
                </p>

                {/* Vertical on mobile, horizontal from md and up */}
                <ol
                    aria-label="Order tracking progress steps"
                    className="relative flex flex-col md:flex-row md:items-start md:justify-between"
                >
                    {steps.map((step, index) => {
                        const isCompleted = index <= current;
                        const isCurrentStep = index === current;
                        const isLast = index === steps.length - 1;
                        const isSegmentReached = index < current;
                        const Icon = step.icon;

                        const timestamp = isCompleted
                            ? formatStepTime(getStepTimestamp(order, step.key))
                            : null;

                        const description = isCurrentStep
                            ? step.currentDescription ?? step.reachedDescription
                            : isCompleted
                                ? step.reachedDescription
                                : step.upcomingDescription;

                        const showPulse = isCurrentStep && !isFullyDelivered;

                        return (
                            <li
                                key={step.key}
                                aria-current={isCurrentStep ? "step" : undefined}
                                className={cn(
                                    "relative flex gap-4",
                                    "md:flex-1 md:flex-col md:items-center md:gap-3 md:text-center",
                                    !isLast && "pb-8 md:pb-0"
                                )}
                            >
                                {/* Connector: vertical line on mobile, horizontal line on md+ */}
                                {!isLast && (
                                    <div
                                        aria-hidden="true"
                                        className={cn(
                                            "absolute z-0 transition-colors duration-300",
                                            // mobile (vertical)
                                            "left-5 top-10 bottom-0 -translate-x-1/2 border-l-2",
                                            // md+ (horizontal)
                                            "md:left-1/2 md:top-5 md:bottom-auto md:h-0 md:w-full md:translate-x-0 md:border-l-0 md:border-t-2",
                                            isSegmentReached
                                                ? "border-dashed border-emerald-500 dark:border-emerald-400"
                                                : "border-dotted border-border"
                                        )}
                                    />
                                )}

                                {/* Step Icon Badge */}
                                <div className="relative h-10 w-10 shrink-0">
                                    {showPulse && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 animate-pulse rounded-full bg-emerald-500/40 motion-reduce:animate-none dark:bg-emerald-400/40"
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-colors motion-reduce:transition-none",
                                            isCompleted
                                                ? "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
                                                : "border-border text-muted-foreground"
                                        )}
                                    >
                                        {isCompleted && !showPulse ? (
                                            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <Icon className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </div>
                                </div>

                                {/* Step Details */}
                                <div className="min-w-0 flex-1 space-y-0.5 pt-1 md:flex-none md:px-1 md:pt-0">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:flex-col md:gap-1">
                                        <p
                                            className={cn(
                                                "text-sm font-semibold tracking-tight",
                                                isCompleted ? "text-foreground" : "text-muted-foreground"
                                            )}
                                        >
                                            {step.title}
                                        </p>
                                        {showPulse && (
                                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                                                Current Status
                                            </span>
                                        )}
                                    </div>

                                    {timestamp && (
                                        <p className="text-xs tabular-nums text-muted-foreground">
                                            {timestamp}
                                        </p>
                                    )}

                                    <p
                                        className={cn(
                                            "text-xs font-light",
                                            isCompleted ? "text-muted-foreground" : "text-muted-foreground/70"
                                        )}
                                    >
                                        {description}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </CardContent>
        </Card>
    );
}