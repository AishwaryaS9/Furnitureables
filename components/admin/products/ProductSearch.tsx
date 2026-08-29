"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function ProductSearch({ value, onChange }: Props) {
    return (
        <div className="relative w-full">
            <label htmlFor="product-search-input" className="sr-only">
                Search products by title or SKU
            </label>

            {/* Search Icon Indicator */}
            <div
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
            >
                <Search className="h-4 w-4" />
            </div>

            {/* Search Input Field */}
            <Input
                id="product-search-input"
                type="search"
                placeholder="Search products by title, SKU..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 w-full rounded-2xl border-border/60 bg-card/60 pl-10 pr-10 text-sm backdrop-blur-xl shadow-xs transition-all duration-200 placeholder:text-muted-foreground/70 focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-primary/30 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
            />

            {/* Clear Search Trigger */}
            {value && (
                <div className="absolute inset-y-0 right-1.5 flex items-center">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onChange("")}
                        className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        aria-label="Clear product search input"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
            )}
        </div>
    );
}