"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
    const setFilter = useFilterStore((s) => s.setFilter);
    const search = useFilterStore((s) => s.filters.search);

    const handleClear = () => {
        setFilter("search", undefined);
    };

    return (
        <div className="relative w-full">
            <label htmlFor="catalog-search" className="sr-only">
                Search furniture catalog
            </label>

            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground z-10">
                <Search className="w-4 h-4" aria-hidden="true" />
            </div>

            <Input
                id="catalog-search"
                type="search"
                value={search ?? ""}
                onChange={(e) => setFilter("search", e.target.value || undefined)}
                placeholder="Search solid wood pieces..."
                aria-label="Search furniture catalog"
                className="w-full h-10 bg-card text-foreground text-xs font-medium rounded-lg pl-10 pr-9 py-2.5 shadow-xs placeholder:text-muted-foreground/70
                [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
            />

            {search && (
                <div className="absolute inset-y-0 right-1 flex items-center z-10">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        aria-label="Clear search input"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                    >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                </div>
            )}
        </div>
    );
}