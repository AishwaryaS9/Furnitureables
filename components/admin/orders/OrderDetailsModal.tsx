"use client";

import Image from "next/image";
import { Calendar, User, Mail, ShoppingBag, CreditCard, Copy, Package } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminOrder } from "@/types/order";
import { formatCurrency, formatOrderDate, getPaymentMethodLabel } from "@/lib/order";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import PaymentStatusBadge from "@/components/orders/PaymentStatusBadge";

interface Props {
    order: AdminOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function OrderDetailsModal({ order, open, onOpenChange }: Props) {
    if (!order) return null;

    const handleCopyOrderId = async (orderNumber: string) => {
        try {
            await navigator.clipboard.writeText(orderNumber);
            toast.success("Copied to clipboard", {
                description: `Order ID ${orderNumber} copied successfully.`,
            });
        } catch {
            toast.error("Failed to copy", {
                description: "Please check your browser permissions.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-lg max-w-[95vw] rounded-2xl p-6 shadow-xl overflow-hidden"
                aria-describedby="order-details-description"
            >
                <DialogHeader className="space-y-1 text-left">
                    <div className="flex items-center justify-between gap-2 pr-6">
                        <DialogTitle className="text-lg font-bold tracking-tight">
                            Order Overview
                        </DialogTitle>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                            {order.orderNumber}
                        </span>
                    </div>
                    <DialogDescription id="order-details-description" className="text-xs text-muted-foreground">
                        Summary information, purchased products, and transaction records.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2 text-sm">
                    {/* Statuses Grid */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60">
                        <div>
                            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block mb-1">
                                Fulfillment Status
                            </span>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <div>
                            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block mb-1">
                                Payment Status
                            </span>
                            <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                    </div>

                    {/* Ordered Items Section (Scroll restricted to this container) */}
                    {order.items && order.items.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Ordered Items ({order.items.length})
                                </span>
                                {order.items.length > 2 && (
                                    <span className="text-[10px] text-muted-foreground">
                                        Scroll to see all
                                    </span>
                                )}
                            </div>

                            <div className="max-h-45 overflow-y-auto rounded-xl border border-border/60 divide-y divide-border/40 bg-card pr-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 text-xs">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Product Image Thumbnail */}
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/50 flex items-center justify-center">
                                                {item.productImage ? (
                                                    <Image
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Package className="h-5 w-5 text-muted-foreground/50" aria-hidden="true" />
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="min-w-0">
                                                <p className="font-medium text-foreground truncate max-w-40 sm:max-w-50">
                                                    {item.productName}
                                                </p>
                                                <p className="text-muted-foreground text-[11px] mt-0.5">
                                                    Qty: <span className="font-semibold text-foreground">{item.quantity}</span> × {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Subtotal for Item */}
                                        <div className="text-right font-semibold text-foreground tabular-nums shrink-0">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Customer & Order Metadata */}
                    <div className="space-y-2.5 rounded-xl border border-border/60 p-4">
                        <div className="flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span>Customer Name</span>
                            </div>
                            <span className="font-medium text-foreground text-right truncate">
                                {order.customerName}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span>Customer Email</span>
                            </div>
                            <span className="font-medium text-foreground text-right truncate">
                                {order.customerEmail}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span>Order Date</span>
                            </div>
                            <span className="font-medium text-foreground">
                                {formatOrderDate(order.createdAt)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span>Total Items</span>
                            </div>
                            <span className="font-medium text-foreground tabular-nums">
                                {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CreditCard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span>Payment Method</span>
                            </div>
                            <span className="font-medium text-foreground">
                                {getPaymentMethodLabel(order.paymentMethod)}
                            </span>
                        </div>

                        <div className="border-t border-border/60 pt-2.5 mt-2.5 flex items-center justify-between text-sm">
                            <span className="font-semibold text-foreground">Total Amount</span>
                            <span className="font-bold text-foreground text-base tabular-nums">
                                {formatCurrency(order.total)}
                            </span>
                        </div>
                    </div>

                    {/* Copy ID Shortcut Button */}
                    <button
                        type="button"
                        onClick={() => handleCopyOrderId(order.orderNumber)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-background py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                    >
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        Copy Order Reference ID
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}