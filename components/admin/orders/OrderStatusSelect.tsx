"use client";

import * as React from "react";
import { Loader2, CheckCircle2, Truck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminUpdateOrderStatus } from "@/hooks/useAdminUpdateOrderStatus";
import { getOrderStatusColor, STATUS_OPTIONS } from "@/lib/order";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/order";

interface Props {
    orderId: string;
    orderNumber: string;
    status: OrderStatus;
    className?: string;
}

function formatStatusLabel(status: OrderStatus) {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

function renderStatusIcon(status: OrderStatus) {
    switch (status) {
        case "PENDING":
            return <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />;
        case "CONFIRMED":
            return <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />;
        case "SHIPPED":
            return <Truck className="h-3 w-3 shrink-0" aria-hidden="true" />;
        case "DELIVERED":
            return <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />;
        case "CANCELLED":
            return <XCircle className="h-3 w-3 shrink-0" aria-hidden="true" />;
        default:
            return null;
    }
}

export default function OrderStatusSelect({ orderId, orderNumber, status, className }: Props) {
    const { mutate, isPending } = useAdminUpdateOrderStatus();

    const [pendingStatus, setPendingStatus] = React.useState<OrderStatus | null>(null);

    const handleChange = (value: OrderStatus | null) => {
        if (!value || value === status) return;
        setPendingStatus(value);
    };

    const handleConfirm = () => {
        if (!pendingStatus) return;

        const nextStatus = pendingStatus;

        mutate(
            { id: orderId, status: nextStatus },
            {
                onSuccess: () => {
                    toast.success("Order status updated", {
                        description: `Order ${orderNumber} is now ${formatStatusLabel(nextStatus)}.`,
                    });
                },
                onError: (error) => {
                    toast.error("Failed to update order status", {
                        description:
                            error instanceof Error
                                ? error.message
                                : "Please try again.",
                    });
                },
            }
        );

        setPendingStatus(null);
    };

    return (
        <>
            <Select value={status} onValueChange={handleChange} disabled={isPending}>
                <SelectTrigger
                    size="sm"
                    aria-label={`Change status for order ${orderNumber}, current status: ${status}`}
                    className={cn(
                        "h-7 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-normal shadow-none transition-colors",
                        getOrderStatusColor(status),
                        className
                    )}
                >
                    {isPending ? (
                        <Loader2 className="h-3 w-3 shrink-0 animate-spin" aria-hidden="true" />
                    ) : (
                        renderStatusIcon(status)
                    )}
                    <SelectValue>
                        {formatStatusLabel(status)}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent className="rounded-xl">
                    {STATUS_OPTIONS.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer rounded-lg text-xs font-medium"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <AlertDialog
                open={pendingStatus !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingStatus(null);
                }}
            >
                <AlertDialogContent className="rounded-2xl border-border bg-card p-6 shadow-lg sm:max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-serif text-lg font-normal text-foreground">
                            Change order status?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-muted-foreground font-light leading-relaxed">
                            {pendingStatus && (
                                <>
                                    Order <span className="font-medium text-foreground">#{orderNumber}</span> will be
                                    moved from <span className="font-medium text-foreground">{formatStatusLabel(status)}</span> to{" "}
                                    <span className="font-medium text-foreground">{formatStatusLabel(pendingStatus)}</span>.
                                    {pendingStatus === "CANCELLED" && " Reserved stock for this order will be restored to inventory."}
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-4 flex flex-row items-center justify-end gap-2">
                        <AlertDialogCancel className="h-9 px-4 text-xs font-medium rounded-xl border-border bg-card hover:bg-secondary cursor-pointer mt-0">
                            No
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirm();
                            }}
                            disabled={isPending}
                            className="h-9 px-4 text-xs font-semibold rounded-xl cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <span>Yes</span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

