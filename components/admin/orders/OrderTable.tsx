"use client";

import * as React from "react";
import { PackageSearch, MoreHorizontal, Eye, Copy, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { AdminOrder, OrderStatus } from "@/types/order";
import { formatCurrency, formatOrderDate, getPaymentMethodLabel } from "@/lib/order";
import PaymentStatusBadge from "@/components/orders/PaymentStatusBadge";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderStatusSelect from "./OrderStatusSelect";

interface Props {
    orders: AdminOrder[];
    onViewOrder?: (orderId: string) => void;
}

export default function OrderTable({ orders, onViewOrder }: Props) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

    const selectedOrder = React.useMemo(
        () => orders.find((order) => order.id === selectedOrderId) ?? null,
        [orders, selectedOrderId]
    );

    const handleViewDetails = (order: AdminOrder) => {
        setSelectedOrderId(order.id);
        setIsDialogOpen(true);
        onViewOrder?.(order.id);
    };

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
        <>
            <section
                aria-label="Customer Orders Overview"
                className="rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-md overflow-hidden"
            >
                <div
                    className="overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    tabIndex={0}
                    role="region"
                    aria-label="Orders Data Table Scrollable Area"
                >
                    <Table aria-label="Customer Orders Table" className="w-full min-w-220 text-left">
                        <TableHeader>
                            <TableRow className="border-b border-border/70 bg-muted/50 hover:bg-muted/50">
                                <TableHead scope="col" className="py-3.5 pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order</TableHead>
                                <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</TableHead>
                                <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Date</TableHead>
                                <TableHead scope="col" className="py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</TableHead>
                                <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Status</TableHead>
                                <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</TableHead>
                                <TableHead scope="col" className="py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</TableHead>
                                <TableHead scope="col" className="py-3.5 pr-6 w-12 text-right sr-only">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orders.map((order) => {
                                const date = formatOrderDate(order.createdAt);
                                const dateIso = new Date(order.createdAt).toISOString();

                                return (
                                    <TableRow
                                        key={order.id}
                                        className="group border-b border-border/40 transition-colors hover:bg-muted/40"
                                    >
                                        {/* Order Number */}
                                        <TableCell className="py-4 pl-6">
                                            <span className="font-mono text-sm font-medium text-foreground tracking-tight whitespace-nowrap">
                                                {order.orderNumber}
                                            </span>
                                        </TableCell>

                                        {/* Customer */}
                                        <TableCell className="py-4">
                                            <div className="min-w-0">
                                                <div className="font-medium text-sm text-foreground truncate max-w-37.5 sm:max-w-50">
                                                    {order.customerName}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate max-w-37.5 sm:max-w-50">
                                                    {order.customerEmail}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="py-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                            <time dateTime={dateIso}>{date}</time>
                                        </TableCell>

                                        {/* Items */}
                                        <TableCell className="py-4 text-center">
                                            <span
                                                className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums whitespace-nowrap"
                                                aria-label={`${order.itemsCount} ${order.itemsCount === 1 ? "item" : "items"} in order`}
                                            >
                                                {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                                            </span>
                                        </TableCell>

                                        {/* Order Status */}
                                        <TableCell className="py-4 whitespace-nowrap">
                                            <OrderStatusSelect
                                                orderId={order.id}
                                                orderNumber={order.orderNumber}
                                                status={order.status as OrderStatus}
                                            />
                                        </TableCell>

                                        {/* Payment Method & Status */}
                                        <TableCell className="py-4">
                                            <div className="space-y-1">
                                                <div>
                                                    <PaymentStatusBadge status={order.paymentStatus} />
                                                </div>
                                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium whitespace-nowrap">
                                                    <CreditCard className="h-3 w-3 shrink-0" aria-hidden="true" />
                                                    <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Total */}
                                        <TableCell className="py-4 text-right font-semibold text-foreground text-sm tabular-nums whitespace-nowrap">
                                            <span aria-label={`Total amount: ${formatCurrency(order.total)}`}>
                                                {formatCurrency(order.total)}
                                            </span>
                                        </TableCell>

                                        {/* Actions Menu */}
                                        <TableCell className="py-4 pr-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                                                    aria-label={`Open actions menu for order ${order.orderNumber}`}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 shadow-md rounded-xl p-1 z-50">
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => handleViewDetails(order)}
                                                            className="cursor-pointer gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors focus:bg-accent focus:text-accent-foreground"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                                            <span>View Order Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleCopyOrderId(order.orderNumber)}
                                                            className="cursor-pointer gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors focus:bg-accent focus:text-accent-foreground"
                                                        >
                                                            <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                                            <span>Copy Order ID</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            {/* Empty State */}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center p-8 text-center" role="status" aria-live="polite" aria-atomic="true">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 border border-border/80 mb-3" aria-hidden="true">
                                                <PackageSearch className="h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-foreground">No orders found</h3>
                                            <p className="text-xs text-muted-foreground max-w-xs mt-1">
                                                Try adjusting your search query, filter criteria, or check back later.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </section>

            {/* Separated Order Details Modal */}
            <OrderDetailsModal
                order={selectedOrder}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </>
    );
}