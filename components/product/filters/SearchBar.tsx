"use client";

import { useId } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/store/useFilterStore";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    className?: string;
    inputClassName?: string;
    clearButtonClassName?: string;
    onSearchSubmit?: () => void;
}

export default function SearchBar({ className, inputClassName, clearButtonClassName, onSearchSubmit }: SearchBarProps) {
    const searchId = useId();
    const router = useRouter();
    const pathname = usePathname();

    const setFilter = useFilterStore((s) => s.setFilter);
    const searchFilter = useFilterStore((s) => s.filters.search);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (pathname !== "/products") {
            router.push("/products");
        }
        onSearchSubmit?.();
    };

    return (
        <form role="search" onSubmit={handleSubmit} className={cn("relative", className)}>
            <label htmlFor={searchId} className="sr-only">
                Search solid wood furniture catalog
            </label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground z-10">
                <Search className="w-4 h-4" aria-hidden="true" />
            </div>

            <Input
                id={searchId}
                type="search"
                value={searchFilter ?? ""}
                onChange={(e) => setFilter("search", e.target.value || undefined)}
                placeholder="Search solid wood pieces..."
                aria-label="Search furniture catalog"
                className={cn(
                    "w-full bg-muted/40 text-foreground text-xs font-medium rounded-full pl-10 pr-9 border-border/80 focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
                    inputClassName
                )}
            />

            {searchFilter && (
                <div className="absolute inset-y-0 right-1 flex items-center z-10">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFilter("search", undefined)}
                        aria-label="Clear search input"
                        className={cn(
                            "h-7 w-7 text-muted-foreground hover:text-foreground rounded-full transition-colors",
                            clearButtonClassName
                        )}
                    >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                </div>
            )}
        </form>
    );
}