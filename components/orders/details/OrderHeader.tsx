import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import OrderStatusBadge from "../OrderStatusBadge";
import PaymentStatusBadge from "../PaymentStatusBadge";
import { formatOrderDate } from "@/lib/order";
import { Order } from "@/types/order";

interface OrderHeaderProps {
    order: Order;
}

export default function OrderHeader({
    order,
}: OrderHeaderProps) {
    return (
        <div className="space-y-6">
            <Button
                // asChild
                variant="ghost"
                className="w-fit"
            >
                <Link href="/orders">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Link>
            </Button>

            <div className="flex flex-col gap-4 rounded-xl border bg-background p-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                        Order #{order.orderNumber}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Placed on {formatOrderDate(order.createdAt)}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Payment type: {order.paymentMethod}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <PaymentStatusBadge
                        status={order.paymentStatus}
                    />
                </div>
            </div>
        </div>
    );
}