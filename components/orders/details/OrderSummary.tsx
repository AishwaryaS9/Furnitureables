import { formatCurrency } from "@/lib/order";
import { Order } from "@/types/order";


interface Props {
    order: Order;
}

export default function OrderSummary({ order }: Props) {
    return (
        <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-5 text-lg font-semibold">
                Order Summary
            </h2>

            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                        Subtotal
                    </span>

                    <span>
                        {formatCurrency(order.subtotal, order.currency)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                        Shipping
                    </span>

                    <span>
                        {formatCurrency(order.shipping, order.currency)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                        Tax
                    </span>

                    <span>
                        {formatCurrency(order.tax, order.currency)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                        Discount
                    </span>

                    <span className="text-green-600">
                        -{formatCurrency(order.discount, order.currency)}
                    </span>
                </div>

                <div className="my-4 border-t" />

                <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>

                    <span>
                        {formatCurrency(order.total, order.currency)}
                    </span>
                </div>
            </div>
        </div>
    );
}