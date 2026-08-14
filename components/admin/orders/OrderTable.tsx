"use client";

import { PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminOrder } from "@/types/order";

interface Props {
    orders: AdminOrder[];
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

function toTitleCase(status: string) {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

function renderStatusBadge(status: AdminOrder["status"]) {
    switch (status) {
        case "DELIVERED":
            return (
                <Badge className="rounded-xl px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                    Delivered
                </Badge>
            );
        case "SHIPPED":
            return (
                <Badge className="rounded-xl px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20">
                    Shipped
                </Badge>
            );
        case "CONFIRMED":
            return (
                <Badge className="rounded-xl px-2.5 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20">
                    Confirmed
                </Badge>
            );
        case "CANCELLED":
            return (
                <Badge variant="destructive" className="rounded-xl px-2.5 py-1 text-xs font-medium">
                    Cancelled
                </Badge>
            );
        case "PENDING":
        default:
            return (
                <Badge className="rounded-xl px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20">
                    Pending
                </Badge>
            );
    }
}

function renderPaymentBadge(paymentStatus: AdminOrder["paymentStatus"]) {
    if (paymentStatus === "PAID") {
        return (
            <Badge variant="outline" className="rounded-xl px-2.5 py-1 text-xs font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                Paid
            </Badge>
        );
    }
    if (paymentStatus === "FAILED") {
        return (
            <Badge variant="outline" className="rounded-xl px-2.5 py-1 text-xs font-medium border-destructive/30 text-destructive">
                Failed
            </Badge>
        );
    }
    if (paymentStatus === "REFUNDED") {
        return (
            <Badge variant="outline" className="rounded-xl px-2.5 py-1 text-xs font-medium border-muted-foreground/30 text-muted-foreground">
                Refunded
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="rounded-xl px-2.5 py-1 text-xs font-medium border-amber-500/30 text-amber-600 dark:text-amber-400">
            Pending
        </Badge>
    );
}

export default function OrderTable({ orders }: Props) {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <Table aria-label="Orders Table">
                    <TableHeader>
                        <TableRow className="border-b border-border/60 bg-muted/40 hover:bg-muted/40">
                            <TableHead className="py-4 pl-6 font-semibold">Order</TableHead>
                            <TableHead className="py-4 font-semibold">Customer</TableHead>
                            <TableHead className="hidden md:table-cell py-4 font-semibold">Date</TableHead>
                            <TableHead className="hidden sm:table-cell py-4 font-semibold text-center">Items</TableHead>
                            <TableHead className="py-4 font-semibold">Status</TableHead>
                            <TableHead className="hidden lg:table-cell py-4 font-semibold">Payment</TableHead>
                            <TableHead className="py-4 pr-6 text-right font-semibold">Total</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {orders.map((order) => {
                            const date = dateFormatter.format(new Date(order.createdAt));

                            return (
                                <TableRow
                                    key={order.id}
                                    className="border-b border-border/40 transition-colors hover:bg-muted/30"
                                >
                                    <TableCell className="py-3.5 pl-6 font-medium text-foreground">
                                        {order.orderNumber}
                                        <div className="md:hidden text-xs text-muted-foreground font-normal mt-0.5">
                                            {date}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-3.5">
                                        <div className="font-medium text-foreground line-clamp-1">
                                            {order.customerName}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-normal mt-0.5 line-clamp-1">
                                            {order.customerEmail}
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell py-3.5 text-xs font-medium text-muted-foreground">
                                        {date}
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell py-3.5 text-center text-xs font-medium text-muted-foreground">
                                        {order.itemsCount}
                                    </TableCell>

                                    <TableCell className="py-3.5">
                                        {renderStatusBadge(order.status)}
                                        <div className="lg:hidden mt-1.5">
                                            {renderPaymentBadge(order.paymentStatus)}
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden lg:table-cell py-3.5">
                                        <div className="space-y-1">
                                            {renderPaymentBadge(order.paymentStatus)}
                                            <div className="text-[11px] text-muted-foreground font-medium">
                                                {toTitleCase(order.paymentMethod)}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-3.5 pr-6 text-right font-semibold text-foreground">
                                        {currencyFormatter.format(order.total)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-56 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                        <PackageSearch className="h-10 w-10 text-muted-foreground/40" />
                                        <p className="text-sm font-semibold">No orders match your filter.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
