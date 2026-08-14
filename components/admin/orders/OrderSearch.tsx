"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type OrderStatusFilter =
    | "ALL"
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

interface Props {
    value: string;
    onChange: (value: string) => void;
    status: OrderStatusFilter;
    onStatusChange: (status: OrderStatusFilter) => void;
}

const STATUS_OPTIONS: { value: OrderStatusFilter; label: string }[] = [
    { value: "ALL", label: "All statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];

export default function OrderSearch({ value, onChange, status, onStatusChange }: Props) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
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

            <Select value={status} onValueChange={(v) => onStatusChange(v as OrderStatusFilter)}>
                <SelectTrigger
                    className="h-11 w-full sm:w-48 rounded-2xl border-border/60 bg-card/60 text-sm backdrop-blur-xl shadow-xs"
                    aria-label="Filter orders by status"
                >
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
