"use client";

import { Calendar, Mail, MapPin, Loader2, ShoppingBag, PackageSearch, Home } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAdminCustomer } from "@/hooks/useAdminCustomer";
import { formatCurrency, formatOrderDate } from "@/lib/order";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import PaymentStatusBadge from "@/components/orders/PaymentStatusBadge";

interface Props {
    customerId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CustomerDetailsModal({ customerId, open, onOpenChange }: Props) {
    const { data: customer, isLoading } = useAdminCustomer(customerId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-lg max-w-[95vw] rounded-2xl p-6 shadow-xl overflow-hidden"
                aria-describedby="customer-details-description"
            >
                <DialogHeader className="space-y-1 text-left">
                    <div className="flex items-center justify-between gap-2 pr-6">
                        <DialogTitle className="text-lg font-bold tracking-tight">
                            Customer Overview
                        </DialogTitle>
                        <span
                            className="font-mono text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                            aria-label={`Customer reference: ${customerId}`}
                        >
                            {customerId}
                        </span>
                    </div>
                    <DialogDescription id="customer-details-description" className="text-xs text-muted-foreground">
                        Profile information, saved addresses, and order history.
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground" role="status" aria-live="polite">
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        <span className="text-xs font-medium">Loading customer details...</span>
                    </div>
                )}

                {!isLoading && !customer && (
                    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center" role="status" aria-live="polite">
                        <PackageSearch className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
                        <p className="text-sm font-medium text-foreground">Customer not found</p>
                        <p className="text-xs text-muted-foreground">This customer may have been removed.</p>
                    </div>
                )}

                {!isLoading && customer && (
                    <div className="space-y-4 pt-2 text-sm">
                        {/* Profile Header */}
                        <section
                            aria-label="Customer Profile"
                            className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-foreground truncate">{customer.name}</p>
                                <a
                                    href={`mailto:${customer.email}`}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs w-fit"
                                >
                                    <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
                                    <span className="truncate">{customer.email}</span>
                                </a>
                            </div>
                        </section>

                        {/* Quick Stats */}
                        <section
                            aria-label="Customer Statistics"
                            className="grid grid-cols-3 gap-3 text-center"
                        >
                            <div className="rounded-xl border border-border/60 p-3">
                                <p className="text-base font-bold text-foreground tabular-nums">{customer.totalOrders}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Orders</p>
                            </div>
                            <div className="rounded-xl border border-border/60 p-3">
                                <p className="text-base font-bold text-foreground tabular-nums truncate">
                                    {formatCurrency(customer.totalSpent, customer.currency)}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Spent</p>
                            </div>
                            <div className="rounded-xl border border-border/60 p-3">
                                <p className="text-base font-bold text-foreground tabular-nums">
                                    {formatOrderDate(customer.joinedAt)}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Joined</p>
                            </div>
                        </section>

                        {/* Addresses */}
                        <section aria-labelledby="customer-addresses-heading" className="space-y-2">
                            <h3
                                id="customer-addresses-heading"
                                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
                            >
                                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                                Addresses ({customer.addresses.length})
                            </h3>

                            {customer.addresses.length === 0 ? (
                                <p className="text-xs text-muted-foreground rounded-xl border border-dashed border-border/60 p-4 text-center">
                                    No saved addresses yet.
                                </p>
                            ) : (
                                <ul
                                    role="list"
                                    aria-label="List of saved addresses"
                                    tabIndex={0}
                                    className="max-h-36 overflow-y-auto rounded-xl border border-border/60 divide-y divide-border/40 bg-card pr-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring list-none p-0 m-0"
                                >
                                    {customer.addresses.map((address) => (
                                        <li key={address.id} className="flex items-start gap-2.5 p-3 text-xs">
                                            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="font-medium text-foreground">{address.fullName}</span>
                                                    {address.isDefault && (
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md border-primary/30 text-primary bg-primary/5">
                                                            Default
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground mt-0.5">
                                                    {address.addressLine1}
                                                    {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city}, {address.state} {address.postalCode}, {address.country}
                                                </p>
                                                <p className="text-muted-foreground mt-0.5">
                                                    {address.phoneCode} {address.phone}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Order History */}
                        <section aria-labelledby="customer-orders-heading" className="space-y-2">
                            <h3
                                id="customer-orders-heading"
                                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
                            >
                                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                                Order History ({customer.orders.length})
                            </h3>

                            {customer.orders.length === 0 ? (
                                <p className="text-xs text-muted-foreground rounded-xl border border-dashed border-border/60 p-4 text-center">
                                    No orders placed yet.
                                </p>
                            ) : (
                                <ul
                                    role="list"
                                    aria-label="List of past orders"
                                    tabIndex={0}
                                    className="max-h-52 overflow-y-auto rounded-xl border border-border/60 divide-y divide-border/40 bg-card pr-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring list-none p-0 m-0"
                                >
                                    {customer.orders.map((order) => (
                                        <li key={order.id} className="flex items-center justify-between gap-3 p-3 text-xs">
                                            <div className="min-w-0">
                                                <p className="font-mono font-medium text-foreground truncate">{order.orderNumber}</p>
                                                <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                                                    <Calendar className="h-3 w-3 shrink-0" aria-hidden="true" />
                                                    <time dateTime={new Date(order.createdAt).toISOString()}>
                                                        {formatOrderDate(order.createdAt)}
                                                    </time>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                    <OrderStatusBadge status={order.status} />
                                                    <PaymentStatusBadge status={order.paymentStatus} />
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-semibold text-foreground tabular-nums">
                                                    {formatCurrency(order.total, order.currency)}
                                                </p>
                                                <p className="text-muted-foreground mt-0.5">
                                                    {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
