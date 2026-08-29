"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphql/client";
import { ADMIN_DELETE_REVIEW, ADMIN_UPDATE_REVIEW_STATUS } from "@/lib/graphql/mutations";
import { ADMIN_REVIEWS } from "@/lib/graphql/queries";
import { Review, ReviewStatus } from "@/types/review";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReviewStats from "@/components/admin/reviews/ReviewStats";
import ReviewTable from "@/components/admin/reviews/ReviewTable";
import DeleteReviewDialog from "@/components/admin/reviews/DeleteReviewDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REVIEW_STATUS_OPTIONS } from "@/lib/data";

type Filter = "ALL" | ReviewStatus;

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filter, setFilter] = useState<Filter>("ALL");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

    async function loadReviews() {
        setLoading(true);
        try {
            const result = await graphqlClient.request<{ adminReviews: Review[] }>(ADMIN_REVIEWS, { status: null });
            setReviews(result.adminReviews);
        } catch (error: any) {
            toast.error(error?.response?.errors?.[0]?.message ?? error?.message ?? "Unable to load reviews.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadReviews();
    }, []);

    async function updateStatus(id: string, status: ReviewStatus) {
        setActionId(id);
        try {
            await graphqlClient.request(ADMIN_UPDATE_REVIEW_STATUS, { id, status });
            setReviews((current) => current.map((review) => (review.id === id ? { ...review, status } : review)));
            toast.success(`Review ${status.toLowerCase()}.`);
        } catch (error: any) {
            toast.error(error?.response?.errors?.[0]?.message ?? error?.message ?? "Unable to update review.");
        } finally {
            setActionId(null);
        }
    }

    async function confirmDeleteReview() {
        if (!reviewToDelete) return;
        const id = reviewToDelete.id;
        setActionId(id);
        try {
            await graphqlClient.request(ADMIN_DELETE_REVIEW, { id });
            setReviews((current) => current.filter((review) => review.id !== id));
            toast.success("Review deleted successfully.");
            setReviewToDelete(null);
        } catch (error: any) {
            toast.error(error?.response?.errors?.[0]?.message ?? error?.message ?? "Unable to delete review.");
        } finally {
            setActionId(null);
        }
    }

    const counts = useMemo(
        () => ({
            all: reviews.length,
            pending: reviews.filter((r) => r.status === "PENDING").length,
            approved: reviews.filter((r) => r.status === "APPROVED").length,
            rejected: reviews.filter((r) => r.status === "REJECTED").length,
        }),
        [reviews]
    );

    const filteredReviews = useMemo(() => {
        const query = search.trim().toLowerCase();
        return reviews
            .filter((review) => filter === "ALL" || review.status === filter)
            .filter(
                (review) =>
                    !query ||
                    [review.author.name, review.product.title, review.title ?? "", review.comment ?? ""]
                        .join(" ")
                        .toLowerCase()
                        .includes(query)
            );
    }, [reviews, filter, search]);

    return (
        <main
            id="main-content"
            tabIndex={-1}
            aria-labelledby="reviews-page-heading"
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 focus:outline-none"
        >
            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1
                        id="reviews-page-heading"
                        className="mt-2 font-serif text-3xl sm:text-4xl text-foreground tracking-tight"
                    >
                        Reviews
                    </h1>
                    <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                        Moderate verified customer feedback before it appears on product pages.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="rounded-xl w-fit shadow-xs"
                    onClick={loadReviews}
                    disabled={loading}
                    aria-label={loading ? "Refreshing reviews..." : "Refresh reviews list"}
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        aria-hidden="true"
                    />
                    <span>Refresh</span>
                </Button>
            </header>

            <section aria-label="Review summary metrics">
                <ReviewStats counts={counts} />
            </section>

            <section aria-label="Review search, filter, and moderation table" className="space-y-4 w-full">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
                        <form
                            role="search"
                            onSubmit={(e) => e.preventDefault()}
                            className="relative flex-1 w-full"
                        >
                            <label htmlFor="review-search-input" className="sr-only">
                                Search customer, product, or review text
                            </label>
                            <Search
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <Input
                                id="review-search-input"
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search customer, product, or review..."
                                className="h-11 w-full rounded-2xl border-border/60 bg-card/60 pl-10 pr-4 text-sm backdrop-blur-xl shadow-xs transition-all 
                                duration-200 placeholder:text-muted-foreground/70 focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-primary/30"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                            />
                        </form>

                        {/* Status Filter Dropdown */}
                        <div className="w-full sm:w-42.5 shrink-0">
                            <Select
                                value={filter}
                                onValueChange={(val: Filter | null) => {
                                    if (val) setFilter(val);
                                }}
                            >
                                <SelectTrigger
                                    className="h-11 w-full rounded-2xl border-border/60 bg-card/60 px-4 text-xs font-medium backdrop-blur-xl shadow-xs transition-all duration-200 hover:bg-card focus-visible:ring-1 focus-visible:ring-primary/30 cursor-pointer"
                                    aria-label="Filter reviews by moderation status"
                                >
                                    <SelectValue placeholder="All Statuses">
                                        {REVIEW_STATUS_OPTIONS.find((opt) => opt.value === filter)?.label ?? "All Statuses"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {REVIEW_STATUS_OPTIONS.map((option) => (
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

                    <div role="status" aria-live="polite" aria-atomic="true" className="shrink-0 self-start sm:self-center">
                        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs font-medium">
                            {filteredReviews.length} {filteredReviews.length === 1 ? "review" : "reviews"}
                        </Badge>
                    </div>
                </div>

                <ReviewTable
                    reviews={filteredReviews}
                    loading={loading}
                    actionId={actionId}
                    onStatusChange={updateStatus}
                    onDeleteRequest={setReviewToDelete}
                />
            </section>

            <DeleteReviewDialog
                open={!!reviewToDelete}
                onOpenChange={(open) => !open && setReviewToDelete(null)}
                onConfirm={confirmDeleteReview}
                review={reviewToDelete}
                isLoading={actionId === reviewToDelete?.id}
            />
        </main>
    );
}