import { CheckCircle2, Package, Truck, PackageCheck, XCircle } from "lucide-react";
import { Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
    order: Order;
}

const steps = [
    {
        key: "CONFIRMED",
        title: "Order Placed",
        description: "We've received your order.",
        icon: Package,
    },
    {
        key: "SHIPPED",
        title: "Shipped",
        description: "Your package is on its way.",
        icon: Truck,
    },
    {
        key: "DELIVERED",
        title: "Delivered",
        description: "Package delivered successfully.",
        icon: PackageCheck,
    },
] as const;

const statusIndex = {
    PENDING: -1,
    CONFIRMED: 0,
    SHIPPED: 1,
    DELIVERED: 2,
    CANCELLED: 99,
};

const STATUS_LABELS: Record<Order["status"], string> = {
    PENDING: "Pending",
    CONFIRMED: "Order Placed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

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

    return (
        <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
            <CardHeader className="pb-4 sm:pb-6">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                        Order Status
                    </CardTitle>

                    {/* Legend: makes the dashed-vs-dotted line meaning explicit
              rather than relying on the person to infer it. */}
                    <div
                        aria-hidden="true"
                        className="flex items-center gap-3 text-[11px] text-muted-foreground"
                    >
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-0 w-4 border-t-2 border-dashed border-emerald-500 dark:border-emerald-400" />
                            Completed
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-0 w-4 border-t-2 border-dotted border-border" />
                            Upcoming
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* Quick, non-visual summary so screen-reader users get the
            current status immediately instead of having to step through
            every list item to find which one is current. */}
                <p className="sr-only" role="status">
                    Current status: {STATUS_LABELS[order.status]}
                </p>

                {/* Always horizontal, at every breakpoint. */}
                <ol
                    aria-label="Order tracking progress steps"
                    className="relative flex items-start justify-between"
                >
                    {steps.map((step, index) => {
                        const isCompleted = index <= current;
                        const isCurrentStep = index === current;
                        const isLast = index === steps.length - 1;
                        // The connector to the RIGHT of this step is "done" only once
                        // the order has moved past both endpoints of that segment
                        // (e.g. Order Placed \u2192 Shipped is only dashed once the order
                        // has actually shipped, not while it's merely placed).
                        const isSegmentReached = index < current;
                        const Icon = step.icon;

                        return (
                            <li
                                key={step.key}
                                aria-current={isCurrentStep ? "step" : undefined}
                                className="relative flex flex-1 flex-col items-center gap-2 text-center"
                            >
                                {/* Connector line to the next step */}
                                {!isLast && (
                                    <div
                                        aria-hidden="true"
                                        className={cn(
                                            "absolute top-5 left-1/2 z-0 w-full border-t-2 transition-colors duration-300",
                                            isSegmentReached
                                                ? "border-dashed border-emerald-500 dark:border-emerald-400"
                                                : "border-dotted border-border"
                                        )}
                                    />
                                )}

                                {/* Step Icon Badge */}
                                <div className="relative">
                                    {isCurrentStep && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 rounded-full bg-emerald-500/40 dark:bg-emerald-400/40"
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background transition-colors motion-reduce:transition-none",
                                            isCompleted
                                                ? "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
                                                : "border-border text-muted-foreground"
                                        )}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <Icon className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </div>
                                </div>

                                {/* Step Details Label */}
                                <div className="space-y-0.5 px-1">
                                    <p
                                        className={cn(
                                            "text-xs sm:text-sm font-semibold tracking-tight",
                                            isCompleted ? "text-foreground" : "text-muted-foreground"
                                        )}
                                    >
                                        {step.title}
                                    </p>
                                    <p className="hidden text-[11px] font-light text-muted-foreground sm:block">
                                        {isCompleted ? step.description : "Pending"}
                                    </p>
                                    {isCurrentStep && (
                                        <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                                            Current
                                        </p>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </CardContent>
        </Card>
    );
}