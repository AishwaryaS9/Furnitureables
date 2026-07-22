import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Order } from "@/types/order";
import { formatCurrency, formatOrderDate } from "@/lib/order";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import ProductThumbnail from "./ProductThumbnail";

interface Props {
    order: Order;
}

export default function OrderCard({
    order,
}: Props) {
    return (
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <h3 className="font-semibold">
                        Order #{order.orderNumber}
                    </h3>

                    <p className="text-sm text-muted-foreground">

                        {formatOrderDate(order.createdAt)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <OrderStatusBadge
                            status={order.status}
                        />

                        <PaymentStatusBadge
                            status={order.paymentStatus}
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    {order.items.slice(0, 3).map((item) => (
                        <ProductThumbnail
                            key={item.id}
                            image={item.image}
                            title={item.title}
                        />
                    ))}
                </div>

                <div className="text-right">
                    <p className="font-semibold text-lg">
                        {formatCurrency(
                            order.total,
                            order.currency
                        )}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                    </p>

                    <Link
                        href={`/orders/${order.id}`}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"
                    >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}