"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    totalPages: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
};

const ELLIPSIS = "…" as const;

function getPageNumbers(totalPages: number, currentPage: number, siblingCount = 1): (number | typeof ELLIPSIS)[] {
    const totalNumbersToShow = siblingCount * 2 + 5;

    if (totalPages <= totalNumbersToShow) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    const pages: (number | typeof ELLIPSIS)[] = [1];

    if (showLeftEllipsis) {
        pages.push(ELLIPSIS);
    } else {
        for (let i = 2; i < leftSiblingIndex; i++) pages.push(i);
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) pages.push(i);
    }

    if (showRightEllipsis) {
        pages.push(ELLIPSIS);
    } else {
        for (let i = rightSiblingIndex + 1; i < totalPages; i++) pages.push(i);
    }

    pages.push(totalPages);

    return pages;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: Props) {
    const storePage = useFilterStore((s) => s.page);
    const setStorePage = useFilterStore((s) => s.setPage);

    const page = currentPage ?? storePage;
    const setPage = onPageChange ?? setStorePage;

    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers(totalPages, page);

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-2 py-2 flex-wrap"
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

            {/* PAGE NUMBERS */}
            <ul className="flex items-center gap-1.5 list-none">
                {pageNumbers.map((pageNumber, index) =>
                    pageNumber === ELLIPSIS ? (
                        <li
                            key={`ellipsis-${index}`}
                            aria-hidden="true"
                            className="flex items-center justify-center w-9 h-9 text-xs font-medium text-muted-foreground select-none"
                        >
                            {ELLIPSIS}
                        </li>
                    ) : (
                        <li key={pageNumber}>
                            <Button
                                variant={pageNumber === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPage(pageNumber)}
                                aria-label={`Go to page ${pageNumber}`}
                                aria-current={pageNumber === page ? "page" : undefined}
                                className={
                                    pageNumber === page
                                        ? "h-9 w-9 p-0 text-xs font-semibold rounded-xl shadow-xs"
                                        : "h-9 w-9 p-0 text-xs font-medium rounded-xl border-input bg-card shadow-xs text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                                }
                            >
                                {pageNumber}
                            </Button>
                        </li>
                    )
                )}
            </ul>

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