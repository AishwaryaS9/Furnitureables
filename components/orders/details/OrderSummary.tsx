import { formatCurrency } from "@/lib/order";
import { Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText } from "lucide-react";

interface Props {
    order: Order;
}

export default function OrderSummary({ order }: Props) {
    const currency = order.currency;

    return (
        <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
            <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                    <ReceiptText className="h-4 w-4 text-primary" aria-hidden="true" />
                    <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                        Order Summary
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-3.5 text-xs sm:text-sm">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground font-mono">
                        {formatCurrency(order.subtotal, currency)}
                    </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between text-muted-foreground">
                    <span>Shipping Fee</span>
                    <span className="font-medium text-foreground font-mono">
                        {order.shipping === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-sans uppercase text-[11px] font-semibold tracking-wider">
                                Free
                            </span>
                        ) : (
                            formatCurrency(order.shipping, currency)
                        )}
                    </span>
                </div>

                {/* Tax */}
                <div className="flex items-center justify-between text-muted-foreground">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-foreground font-mono">
                        {formatCurrency(order.tax, currency)}
                    </span>
                </div>

                {/* Discount (Only shown if discount exists) */}
                {order.discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Discount</span>
                        <span className="font-medium font-mono">
                            -{formatCurrency(order.discount, currency)}
                        </span>
                    </div>
                )}

                {/* Divider */}
                <div className="my-3 border-t border-border/40" />

                {/* Total Ledger Row */}
                <div className="flex items-center justify-between pt-1 text-sm sm:text-base font-semibold text-foreground">
                    <span>Total Paid</span>
                    <span className="text-lg sm:text-xl font-semibold tracking-tight text-primary">
                        {formatCurrency(order.total, currency)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}