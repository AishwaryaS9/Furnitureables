"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Loader2, MessageSquareQuote, Pencil, ShieldCheck, Star, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphql/client";
import { DELETE_REVIEW } from "@/lib/graphql/mutations";
import { PRODUCT_REVIEWS } from "@/lib/graphql/queries";
import { ProductReviews as ProductReviewsData } from "@/types/review";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import ReviewForm from "./ReviewForm";
import Pagination from "./Pagination";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";


const REVIEWS_PER_PAGE = 5;

function Stars({ value }: { value: number }) {
    return (
        <div
            className="inline-flex items-center gap-0.5"
            role="img"
            aria-label={`${value} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 shrink-0 transition-colors ${star <= value
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted/20 text-muted-foreground/30"
                        }`}
                />
            ))}
        </div>
    );
}

export default function ProductReviews({ productId, initialData }: {
    productId: string;
    initialData: ProductReviewsData;
}) {
    const [data, setData] = useState(initialData);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { openSignIn } = useClerk();

    async function refresh() {
        const result = await graphqlClient.request<{ productReviews: ProductReviewsData }>(
            PRODUCT_REVIEWS,
            { productId }
        );
        setData(result.productReviews);
    }

    async function deleteReview() {
        if (!data.currentUserReview) return;
        setDeleting(true);
        try {
            await graphqlClient.request(DELETE_REVIEW, { id: data.currentUserReview.id });
            await refresh();
            toast.success("Your review was deleted.");
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ??
                error?.message ??
                "Unable to delete review."
            );
        } finally {
            setDeleting(false);
        }
    }

    const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
        const count = data.reviews.filter((r) => Math.round(r.rating) === stars).length;
        const percentage = data.reviews.length > 0 ? (count / data.reviews.length) * 100 : 0;
        return { stars, count, percentage };
    });

    const totalPages = Math.ceil(data.reviews.length / REVIEWS_PER_PAGE);

    const paginatedReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
        return data.reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
    }, [data.reviews, currentPage]);

    function handlePageChange(newPage: number) {
        setCurrentPage(newPage);
        const headingElement = document.getElementById("customer-reviews-title");
        if (headingElement) {
            headingElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        aggregateRating:
            data.total > 0
                ? {
                    "@type": "AggregateRating",
                    ratingValue: data.averageRating.toFixed(1),
                    reviewCount: data.total,
                    bestRating: "5",
                    worstRating: "1",
                }
                : undefined,
        review: data.reviews.map((r) => ({
            "@type": "Review",
            reviewRating: {
                "@type": "Rating",
                ratingValue: r.rating,
                bestRating: "5",
                worstRating: "1",
            },
            author: {
                "@type": "Person",
                name: r.author.name,
            },
            datePublished: r.createdAt,
            name: r.title || undefined,
            reviewBody: r.comment || undefined,
        })),
    };

    return (
        <section
            aria-labelledby="customer-reviews-title"
            className="mt-14 sm:mt-20 border-t border-border/60 pt-10 sm:pt-14"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="flex flex-col gap-1 mb-8">
                <div className="flex items-center gap-2 text-primary font-medium">
                    <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
                    <span className="text-[10px] uppercase tracking-widest">Community Feedback</span>
                </div>
                <h2
                    id="customer-reviews-title"
                    className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight"
                >
                    Customer Reviews
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                <aside className="lg:col-span-5 xl:col-span-4 space-y-5">
                    <Card className="rounded-2xl border-border/70 bg-card/40 shadow-none">
                        <CardContent className="p-4 sm:p-5 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-semibold tracking-tight text-foreground font-sans">
                                    {data.averageRating ? data.averageRating.toFixed(1) : "0.0"}
                                </div>
                                <div className="space-y-0.5">
                                    <Stars value={Math.round(data.averageRating || 0)} />
                                    <p className="text-[11px] text-muted-foreground">
                                        {data.total} verified {data.total === 1 ? "review" : "reviews"}
                                    </p>
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            <div className="space-y-1.5" role="region" aria-label="Review rating distribution">
                                {ratingCounts.map(({ stars, count, percentage }) => (
                                    <div key={stars} className="flex items-center gap-2.5 text-[11px]">
                                        <span className="w-7 text-muted-foreground flex items-center justify-end gap-0.5 shrink-0 font-medium">
                                            {stars} <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 inline" aria-hidden="true" />
                                        </span>
                                        <Progress
                                            value={percentage}
                                            className="h-1.5 flex-1 rounded-full bg-muted/60"
                                            aria-label={`${stars} star reviews: ${count}`}
                                        />
                                        <span className="w-6 text-right text-muted-foreground font-mono text-[10px] shrink-0">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {data.canReview && !data.currentUserReview && !editing && (
                        <ReviewForm productId={productId} onSaved={refresh} />
                    )}

                    {data.currentUserReview && !editing && (
                        <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                    Your Review
                                </span>
                                <Badge
                                    variant="outline"
                                    className={`rounded-full px-2 py-0.5 text-[9px] font-medium tracking-wide capitalize ${data.currentUserReview.status === "APPROVED"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                        : data.currentUserReview.status === "REJECTED"
                                            ? "bg-destructive/10 text-destructive border-destructive/30"
                                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                        }`}
                                >
                                    {data.currentUserReview.status.toLowerCase()}
                                </Badge>
                            </div>

                            <Stars value={data.currentUserReview.rating} />

                            {data.currentUserReview.title && (
                                <p className="text-xs font-medium text-foreground">
                                    {data.currentUserReview.title}
                                </p>
                            )}

                            {data.currentUserReview.comment && (
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {data.currentUserReview.comment}
                                </p>
                            )}

                            <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 pt-0.5">
                                <Clock className="h-3 w-3" aria-hidden="true" />
                                {data.currentUserReview.status === "APPROVED"
                                    ? "Visible to customers on this product."
                                    : "Pending moderation."}
                            </p>

                            <div className="flex items-center gap-2 pt-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 rounded-lg text-xs gap-1 px-2.5"
                                    onClick={() => setEditing(true)}
                                >
                                    <Pencil className="h-3 w-3" aria-hidden="true" />
                                    <span>Edit</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 rounded-lg text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1 px-2.5"
                                    onClick={deleteReview}
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                    ) : (
                                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                                    )}
                                    <span>Delete</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {editing && data.currentUserReview && (
                        <ReviewForm
                            productId={productId}
                            review={data.currentUserReview}
                            onSaved={async () => {
                                setEditing(false);
                                await refresh();
                            }}
                            onCancel={() => setEditing(false)}
                        />
                    )}

                    {!data.canReview && !data.currentUserReview && (
                        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2">
                            <div className="flex items-start gap-2">
                                <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
                                <div>
                                    <h4 className="text-xs font-semibold text-foreground">
                                        Verified Buyer Reviews
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                                        Reviews can be submitted by verified purchasers once their order is delivered.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/sign-in"
                                className="inline-block text-[11px] font-medium text-primary hover:underline underline-offset-4"
                            >
                                Sign in to check eligibility →
                            </Link>
                            {/* <button
                                type="button"
                                onClick={()=>openSignIn()}
                                className="inline-block text-[11px] font-medium text-primary hover:underline underline-offset-4 cursor-pointer text-left"
                            >
                                Sign in to check eligibility →
                            </button> */}
                        </div>
                    )}
                </aside>

                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                    {data.reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/30 p-10 text-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 border border-border/60 mb-2.5">
                                <MessageSquareQuote className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                            </div>
                            <h3 className="font-serif text-base font-medium text-foreground">
                                No reviews yet
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                                Be the first verified customer to share feedback and inspire future shoppers.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3" role="feed" aria-label="Customer reviews list">
                                {paginatedReviews.map((review) => {
                                    const formattedDate = new Date(review.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    });
                                    const isoDate = new Date(review.createdAt).toISOString();

                                    return (
                                        <article
                                            key={review.id}
                                            aria-labelledby={`review-author-${review.id}`}
                                            className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 shadow-none transition-colors hover:border-border"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-border/40">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                                        <User className="h-3.5 w-3.5" aria-hidden="true" />
                                                    </div>
                                                    <div>
                                                        <span
                                                            id={`review-author-${review.id}`}
                                                            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                                                        >
                                                            {review.author.name}
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-[9px] h-3.5 px-1 font-normal rounded-sm bg-muted text-muted-foreground"
                                                            >
                                                                Verified
                                                            </Badge>
                                                        </span>
                                                        <time
                                                            dateTime={isoDate}
                                                            className="text-[10px] text-muted-foreground block sm:hidden"
                                                        >
                                                            {formattedDate}
                                                        </time>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-2.5">
                                                    <Stars value={review.rating} />
                                                    <time
                                                        dateTime={isoDate}
                                                        className="text-[10px] text-muted-foreground hidden sm:inline"
                                                    >
                                                        {formattedDate}
                                                    </time>
                                                </div>
                                            </div>

                                            <div className="pt-2.5 space-y-1">
                                                {review.title && (
                                                    <h3 className="text-xs font-semibold text-foreground leading-snug">
                                                        {review.title}
                                                    </h3>
                                                )}
                                                {review.comment && (
                                                    <p className="text-xs leading-relaxed text-muted-foreground break-words whitespace-pre-line">
                                                        {review.comment}
                                                    </p>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {totalPages > 1 && (
                                <div className="pt-4">
                                    <Pagination
                                        totalPages={totalPages}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}