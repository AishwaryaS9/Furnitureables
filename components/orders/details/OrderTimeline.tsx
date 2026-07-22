import { CheckCircle2, Circle, Truck, PackageCheck, XCircle } from "lucide-react";
import { Order } from "@/types/order";

interface Props {
    order: Order;
}

const steps = [
    {
        key: "CONFIRMED",
        title: "Order Confirmed",
    },
    {
        key: "SHIPPED",
        title: "Shipped",
    },
    {
        key: "DELIVERED",
        title: "Delivered",
    },
] as const;

const statusIndex = {
    PENDING: -1,
    CONFIRMED: 0,
    SHIPPED: 1,
    DELIVERED: 2,
    CANCELLED: 99,
};

export default function OrderTimeline({ order }: Props) {
    if (order.status === "CANCELLED") {
        return (
            <div className="rounded-2xl border bg-card p-6">
                <h2 className="mb-6 text-lg font-semibold">
                    Order Status
                </h2>

                <div className="flex items-center gap-3 text-red-600">
                    <XCircle className="h-6 w-6 fill-current text-white" />

                    <div>
                        <p className="font-medium">
                            Order Cancelled
                        </p>

                        <p className="text-sm text-muted-foreground">
                            This order has been cancelled.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const current = statusIndex[order.status];

    return (
        <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold">
                Order Status
            </h2>

            <div className="space-y-6">
                {steps.map((step, index) => {
                    const completed = index <= current;

                    return (
                        <div
                            key={step.key}
                            className="relative flex items-start gap-4"
                        >
                            {index !== steps.length - 1 && (
                                <div
                                    className={`absolute left-2.75 top-7 h-10 w-0.5 ${completed
                                        ? "bg-primary"
                                        : "bg-border"
                                        }`}
                                />
                            )}

                            <div className="relative z-10">
                                {completed ? (
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                ) : (
                                    <Circle className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>

                            <div>
                                <p className="font-medium">
                                    {step.title}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {completed
                                        ? "Completed"
                                        : "Pending"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}