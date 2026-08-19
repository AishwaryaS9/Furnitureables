"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquareQuote, RefreshCw, Star, Trash2 } from "lucide-react";
import { Review, ReviewStatus } from "@/types/review";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REVIEW_STATUS_OPTIONS } from "@/lib/data";
import { formatOrderDate } from "@/lib/order";
import ProductPagination from "../products/ProductPagination";

interface ReviewTableProps {
    reviews: Review[];
    loading: boolean;
    actionId: string | null;
    onStatusChange: (id: string, status: ReviewStatus) => void;
    onDeleteRequest: (review: Review) => void;
    currentPage?: number;
    pageSize?: number;
    totalReviews?: number;
    onPageChange?: (page: number) => void;
}

const STATUS_OPTIONS = REVIEW_STATUS_OPTIONS.filter(
    (opt): opt is { value: ReviewStatus; label: string } => opt.value !== "ALL"
);

function Stars({ value }: { value: number }) {
    return (
        <div
            className="flex items-center gap-0.5"
            role="img"
            aria-label={`${value} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 ${star <= value ? "fill-current text-amber-500" : "text-muted-foreground/25"
                        }`}
                />
            ))}
        </div>
    );
}

function statusClass(status: ReviewStatus) {
    if (status === "APPROVED") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20";
    if (status === "REJECTED") return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20";
    return "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20";
}

export default function ReviewTable({
    reviews,
    loading,
    actionId,
    onStatusChange,
    onDeleteRequest,
    currentPage: controlledPage,
    pageSize = 10,
    totalReviews,
    onPageChange: controlledPageChange,
}: ReviewTableProps) {
    const [localPage, setLocalPage] = useState(1);

    const isControlled = controlledPage !== undefined && controlledPageChange !== undefined;
    const activePage = isControlled ? controlledPage : localPage;
    const handlePageChange = isControlled ? controlledPageChange : setLocalPage;

    const totalItems = totalReviews ?? reviews.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    const displayedReviews = isControlled
        ? reviews
        : reviews.slice((activePage - 1) * pageSize, activePage * pageSize);

    return (
        <div
            aria-label="Customer Reviews Management Overview"
            className="w-full rounded-2xl border border-border/80 bg-card/90 shadow-xs backdrop-blur-md overflow-hidden flex flex-col"
        >
            <div
                className="w-full overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                tabIndex={0}
                role="region"
                aria-label="Reviews Data Table Scrollable Area"
            >
                <Table className="w-full text-left">
                    <TableHeader>
                        <TableRow className="border-b border-border/70 bg-muted/50 hover:bg-muted/50">
                            <TableHead scope="col" className="py-3.5 pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[30%] min-w-50">
                                Product
                            </TableHead>
                            <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[45%]">
                                Feedback
                            </TableHead>
                            <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[15%] min-w-32.5">
                                Status
                            </TableHead>
                            <TableHead scope="col" className="py-3.5 pr-6 w-[10%] min-w-12.5 text-right sr-only">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center p-8 text-sm text-muted-foreground" role="status" aria-live="polite">
                                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mb-2" aria-hidden="true" />
                                        <span>Loading customer reviews...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : displayedReviews.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={4} className="h-64 p-0 text-center">
                                    <div className="flex flex-col items-center justify-center p-8 text-center" role="status" aria-live="polite">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 border border-border/80 mb-3" aria-hidden="true">
                                            <MessageSquareQuote className="h-7 w-7 text-muted-foreground/60" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">No reviews found</h3>
                                        <p className="text-xs text-muted-foreground max-w-xs mt-1">
                                            Try adjusting your search query, filter criteria, or check back later.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedReviews.map((review) => {
                                return (
                                    <TableRow
                                        key={review.id}
                                        className="group border-b border-border/40 transition-colors hover:bg-muted/40"
                                    >
                                        {/* Product Column */}
                                        <TableCell className="py-4 pl-6 align-top">
                                            <div className="flex gap-3.5">
                                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                                                    {review.product.image ? (
                                                        <Image
                                                            src={review.product.image}
                                                            alt={`Product image for ${review.product.title}`}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate text-sm font-medium text-foreground max-w-47.5">
                                                        {review.product.title}
                                                    </span>
                                                    <span className="mt-0.5 text-xs text-muted-foreground truncate max-w-47.5">
                                                        by {review.author.name}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground/80 mt-1 font-medium whitespace-nowrap">
                                                        <time dateTime={new Date(review.createdAt).toISOString()}>
                                                            {formatOrderDate(review.createdAt)}
                                                        </time>
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Feedback Column */}
                                        <TableCell className="py-4 align-top max-w-70 sm:max-w-90">
                                            <div className="flex flex-col gap-1 min-w-0 pr-4 whitespace-normal wrap-break-word">
                                                <Stars value={review.rating} />
                                                {review.title && (
                                                    <span className="text-sm font-medium text-foreground leading-snug">
                                                        {review.title}
                                                    </span>
                                                )}
                                                {review.comment && (
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        {review.comment}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Status Dropdown Column */}
                                        <TableCell className="py-4 align-top whitespace-nowrap">
                                            <Select
                                                value={review.status}
                                                onValueChange={(val: ReviewStatus | null) => {
                                                    if (val) onStatusChange(review.id, val);
                                                }}
                                                disabled={actionId === review.id}
                                            >
                                                <SelectTrigger
                                                    className={`h-8 w-30 rounded-full text-xs font-medium ${statusClass(
                                                        review.status
                                                    )}`}
                                                    aria-label={`Change status for review by ${review.author.name} on ${review.product.title}. Current status: ${review.status}`}
                                                >
                                                    <SelectValue placeholder="Status">
                                                        {REVIEW_STATUS_OPTIONS.find((opt) => opt.value === review.status)?.label ??
                                                            review.status.charAt(0) + review.status.slice(1).toLowerCase()}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {STATUS_OPTIONS.map((option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                            className="text-xs font-medium cursor-pointer"
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>

                                        {/* Actions Column */}
                                        <TableCell className="py-4 pr-6 text-right align-top">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground opacity-70 group-hover:opacity-100 
                                                transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                                                onClick={() => onDeleteRequest(review)}
                                                disabled={actionId === review.id}
                                                aria-label={`Delete review by ${review.author.name} for ${review.product.title}`}
                                            >
                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Footer */}
            {!loading && totalItems > 0 && (
                <div className="border-t border-border/70 px-4 py-2 bg-muted/20">
                    <ProductPagination
                        currentPage={activePage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        itemLabel="reviews"
                    />
                </div>
            )}
        </div>
    );
}