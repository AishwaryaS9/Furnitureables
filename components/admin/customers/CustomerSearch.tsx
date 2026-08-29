"use client";

import { ArrowUpDown, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { CustomerSort } from "@/types/customer";
import { CUSTOMER_SORT_OPTIONS } from "@/lib/data";

interface Props {
    value: string;
    onChange: (value: string) => void;
    sort: CustomerSort;
    onSortChange: (sort: CustomerSort) => void;
}

export default function CustomerSearch({ value, onChange, sort, onSortChange }: Props) {
    const selectedSortLabel =
        CUSTOMER_SORT_OPTIONS.find((opt) => opt.value === sort)?.label ?? "Sort by";

    return (
        <form
            role="search"
            aria-label="Customer search and sort"
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full"
        >
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md flex-1">
                <label htmlFor="customer-search-input" className="sr-only">
                    Search customers by name, email address, or customer ID
                </label>

                <div
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                >
                    <Search className="h-4 w-4" />
                </div>

                <Input
                    id="customer-search-input"
                    type="search"
                    name="customerSearch"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="Search by name, email, or customer ID..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-11 w-full rounded-2xl border-border/60 bg-card/60 pl-10 pr-10 text-sm backdrop-blur-xl shadow-xs transition-all duration-200 placeholder:text-muted-foreground/70 focus-visible:bg-card 
                    focus-visible:ring-1 focus-visible:ring-primary/30 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
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

            {/* Sort Dropdown */}
            <div className="w-full lg:w-56 shrink-0">
                <label id="customer-sort-label" htmlFor="customer-sort" className="sr-only">
                    Sort customers
                </label>
                <Select value={sort} onValueChange={(v) => onSortChange(v as CustomerSort)}>
                    <SelectTrigger
                        id="customer-sort"
                        className="h-11 w-full rounded-2xl border-border/60 bg-card/60 text-xs font-medium backdrop-blur-xl shadow-xs"
                        aria-labelledby="customer-sort-label"
                        aria-label={`Sort customers, current: ${selectedSortLabel}`}
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <ArrowUpDown
                                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <span className="truncate font-medium">{selectedSortLabel}</span>
                        </div>
                    </SelectTrigger>

                    <SelectContent className="rounded-xl">
                        {CUSTOMER_SORT_OPTIONS.map((option) => (
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
        </form>
    );
}
