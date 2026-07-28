import { CheckCircle2, Package, Truck, PackageCheck, XCircle } from "lucide-react";
import { Order } from "@/types/order";

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

export default function OrderTimeline({ order }: Props) {
    if (order.status === "CANCELLED") {
        return (
            <div className="rounded-2xl border bg-card p-6">
                <h2 className="mb-6 text-lg font-semibold">
                    Order Status
                </h2>

                <div className="flex items-center gap-3 text-red-600">
                    <XCircle className="h-6 w-6" />

                    <div>
                        <p className="font-medium">
                            Order Cancelled
                        </p>

                        <p className="text-sm text-muted-foreground">
                            This order has been cancelled and will not be processed.
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

                    const Icon = step.icon;

                    return (
                        <div
                            key={step.key}
                            className="relative flex items-start gap-4"
                        >
                            {index !== steps.length - 1 && (
                                <div
                                    className={`absolute left-3 top-7 h-10 w-0.5 ${completed
                                        ? "bg-primary"
                                        : "bg-border"
                                        }`}
                                />
                            )}

                            <div className="relative z-10">
                                {completed ? (
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                ) : (
                                    <Icon className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>

                            <div>
                                <p className="font-medium">
                                    {step.title}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {completed
                                        ? step.description
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