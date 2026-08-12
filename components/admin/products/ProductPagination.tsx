"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: ProductPaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      role="navigation"
      aria-label="Product catalog pagination"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3"
    >
      {/* Dynamic Summary Status */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="text-xs text-muted-foreground font-medium"
      >
        <span>
          Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
          <span className="font-semibold text-foreground">{endItem}</span> of{" "}
          <span className="font-semibold text-foreground">{totalItems}</span> products
        </span>
      </div>

      {/* Pagination Action Controls */}
      <div className="flex items-center gap-1.5">
        <span
          id="pagination-page-status"
          className="text-xs text-muted-foreground font-medium mr-2 hidden sm:inline-block"
          aria-hidden="true"
        >
          Page {currentPage} of {totalPages}
        </span>

        {/* First Page Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page of products"
          aria-disabled={currentPage === 1}
          className="h-8 w-8 rounded-xl border-border/80 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">First Page</span>
        </Button>

        {/* Previous Page Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page of products"
          aria-disabled={currentPage === 1}
          className="h-8 w-8 rounded-xl border-border/80 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Previous Page</span>
        </Button>

        {/* Next Page Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page of products"
          aria-disabled={currentPage >= totalPages}
          className="h-8 w-8 rounded-xl border-border/80 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Next Page</span>
        </Button>

        {/* Last Page Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label={`Go to last page (Page ${totalPages}) of products`}
          aria-disabled={currentPage >= totalPages}
          className="h-8 w-8 rounded-xl border-border/80 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronsRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Last Page</span>
        </Button>
      </div>
    </nav>
  );
}