"use client";

import { Filter, Search, X, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { OrderStatusFilter, PaymentStatusFilter } from "@/types/order";

interface Props {
    value: string;
    onChange: (value: string) => void;
    status: OrderStatusFilter;
    onStatusChange: (status: OrderStatusFilter) => void;
    paymentStatus: PaymentStatusFilter;
    onPaymentStatusChange: (status: PaymentStatusFilter) => void;
}

const STATUS_OPTIONS: { value: OrderStatusFilter; label: string }[] = [
    { value: "ALL", label: "All order statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS: { value: PaymentStatusFilter; label: string }[] = [
    { value: "ALL", label: "All payments statuses" },
    { value: "PAID", label: "Paid" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
    { value: "REFUNDED", label: "Refunded" },
];

export default function OrderSearch({ value, onChange, status, onStatusChange, paymentStatus, onPaymentStatusChange }: Props) {
    return (
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
                <label htmlFor="order-search-input" className="sr-only">
                    Search orders by order number, customer name, or email
                </label>

                <div
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                >
                    <Search className="h-4 w-4" />
                </div>

                <Input
                    id="order-search-input"
                    type="search"
                    placeholder="Search by order #, customer, or email..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-11 w-full rounded-2xl border-border/60 bg-card/60 pl-10 pr-10 text-sm backdrop-blur-xl shadow-xs transition-all duration-200 placeholder:text-muted-foreground/70 focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-primary/30 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                />

                {value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onChange("")}
                        className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        aria-label="Clear order search input"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                )}
            </div>

            {/* Order Status Filter */}
            <div className="w-full sm:w-44">
                <Select
                    value={status}
                    onValueChange={(v) => onStatusChange(v as OrderStatusFilter)}
                >
                    <SelectTrigger
                        className="h-11 w-full rounded-2xl border-border/60 bg-card/60 text-xs font-medium backdrop-blur-xl shadow-xs"
                        aria-label="Filter orders by status"
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <Filter
                                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <span className="truncate font-medium">
                                {STATUS_OPTIONS.find((opt) => opt.value === status)?.label ??
                                    "Filter by status"}
                            </span>
                        </div>
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
            </div>

            {/* Payment Status Filter */}
            <div className="w-full sm:w-50">
                <Select
                    value={paymentStatus}
                    onValueChange={(v) => onPaymentStatusChange(v as PaymentStatusFilter)}
                >
                    <SelectTrigger
                        className="h-11 w-full rounded-2xl border-border/60 bg-card/60 text-xs font-medium backdrop-blur-xl shadow-xs"
                        aria-label="Filter orders by payment status"
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <CreditCard
                                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <span className="truncate font-medium">
                                {PAYMENT_STATUS_OPTIONS.find((opt) => opt.value === paymentStatus)?.label ??
                                    "Filter by payment"}
                            </span>
                        </div>
                    </SelectTrigger>

                    <SelectContent className="rounded-xl">
                        {PAYMENT_STATUS_OPTIONS.map((option) => (
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
            </div>
        </div>
    );
}