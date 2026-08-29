"use client";

import { Filter, Search, X, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { OrderStatusFilter, PaymentStatusFilter } from "@/types/order";
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/lib/order";

interface Props {
    value: string;
    onChange: (value: string) => void;
    status: OrderStatusFilter;
    onStatusChange: (status: OrderStatusFilter) => void;
    paymentStatus: PaymentStatusFilter;
    onPaymentStatusChange: (status: PaymentStatusFilter) => void;
}

export default function OrderSearch({
    value,
    onChange,
    status,
    onStatusChange,
    paymentStatus,
    onPaymentStatusChange,
}: Props) {
    const selectedStatusLabel =
        ORDER_STATUS_OPTIONS.find((opt) => opt.value === status)?.label ?? "Filter by status";
    const selectedPaymentLabel =
        PAYMENT_STATUS_OPTIONS.find((opt) => opt.value === paymentStatus)?.label ?? "Filter by payment";

    return (
        <form
            role="search"
            aria-label="Order filters and search"
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full"
        >
            {/* Search Input (Takes flexible remaining space) */}
            <div className="relative w-full lg:max-w-md flex-1">
                <label htmlFor="order-search-input" className="sr-only">
                    Search orders by order number, customer name, or email address
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
                    name="orderSearch"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="Search by order #, customer, or email..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-11 w-full rounded-2xl border-border/60 bg-card/60 pl-10 pr-10 text-sm backdrop-blur-xl shadow-xs transition-all duration-200 placeholder:text-muted-foreground/70 focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-primary/30 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                />

                {value && (
                    <div className="absolute inset-y-0 right-1.5 flex items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onChange("")}
                            className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            aria-label="Clear search input query"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Filter Dropdowns in the same row */}
            <div
                role="group"
                aria-label="Order status filter controls"
                className="flex flex-row items-center gap-3 w-full lg:w-auto shrink-0"
            >
                {/* Order Status Filter */}
                <div className="w-1/2 lg:w-44">
                    <label id="status-filter-label" htmlFor="order-status-filter" className="sr-only">
                        Filter by order status
                    </label>
                    <Select
                        value={status}
                        onValueChange={(v) => onStatusChange(v as OrderStatusFilter)}
                    >
                        <SelectTrigger
                            id="order-status-filter"
                            className="h-11 w-full rounded-2xl border-border/60 bg-card/60 text-xs font-medium backdrop-blur-xl shadow-xs"
                            aria-labelledby="status-filter-label"
                            aria-label={`Order status filter, current: ${selectedStatusLabel}`}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <Filter
                                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <span className="truncate font-medium">
                                    {selectedStatusLabel}
                                </span>
                            </div>
                        </SelectTrigger>

                        <SelectContent className="rounded-xl">
                            {ORDER_STATUS_OPTIONS.map((option) => (
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
                <div className="w-1/2 lg:w-50">
                    <label id="payment-filter-label" htmlFor="payment-status-filter" className="sr-only">
                        Filter by payment status
                    </label>
                    <Select
                        value={paymentStatus}
                        onValueChange={(v) => onPaymentStatusChange(v as PaymentStatusFilter)}
                    >
                        <SelectTrigger
                            id="payment-status-filter"
                            className="h-11 w-full rounded-2xl border-border/60 bg-card/60 text-xs font-medium backdrop-blur-xl shadow-xs"
                            aria-labelledby="payment-filter-label"
                            aria-label={`Payment status filter, current: ${selectedPaymentLabel}`}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <CreditCard
                                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <span className="truncate font-medium">
                                    {selectedPaymentLabel}
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
        </form>
    );
}