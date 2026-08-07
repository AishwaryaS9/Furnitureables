"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    totalPages: number;
};

export default function Pagination({ totalPages }: Props) {
    const page = useFilterStore((s) => s.page);
    const setPage = useFilterStore((s) => s.setPage);

    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-3 py-2"
        >
            {/* PREVIOUS BUTTON */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                aria-label="Go to previous page"
                className="h-9 gap-1.5 px-3.5 text-xs font-medium rounded-xl border-input bg-card shadow-xs text-foreground transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
            >
                <ChevronLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* PAGE INDICATOR BADGE */}
            <div
                aria-current="page"
                className="flex items-center justify-center min-w-22 h-9 px-3.5 text-xs font-medium text-muted-foreground bg-secondary/60 border border-border/60 rounded-xl shadow-xs select-none"
            >
                <span className="text-foreground font-semibold">{page}</span>
                <span className="mx-1.5 text-muted-foreground/60">/</span>
                <span>{totalPages}</span>
            </div>

            {/* NEXT BUTTON */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                aria-label="Go to next page"
                className="h-9 gap-1.5 px-3.5 text-xs font-medium rounded-xl border-input bg-card shadow-xs text-foreground transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </Button>
        </nav>
    );
}