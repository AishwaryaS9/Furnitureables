"use client";

import { FormEvent, useId, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphql/client";
import { CREATE_REVIEW, UPDATE_REVIEW } from "@/lib/graphql/mutations";
import { Review } from "@/types/review";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewFormProps {
    productId: string;
    review?: Review | null;
    onSaved: () => Promise<void>;
    onCancel?: () => void;
}

function StarRatingSelector({ value, onChange }: {
    value: number;
    onChange: (v: number) => void;
}) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const activeValue = hoverValue ?? value;

    return (
        <div
            role="radiogroup"
            aria-label="Rating selection"
            className="flex items-center gap-1"
            onMouseLeave={() => setHoverValue(null)}
        >
            {[1, 2, 3, 4, 5].map((star) => {
                const isSelected = star === value;
                const isHighlighted = star <= activeValue;

                return (
                    <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${star} of 5 stars`}
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHoverValue(star)}
                        onFocus={() => setHoverValue(star)}
                        onBlur={() => setHoverValue(null)}
                        className="group rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <Star
                            aria-hidden="true"
                            className={`h-5 w-5 transition-colors duration-150 ${isHighlighted
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted/20 text-muted-foreground/35"
                                }`}
                        />
                    </button>
                );
            })}
            <span className="ml-2 text-xs text-muted-foreground" aria-live="polite">
                {activeValue > 0 ? `${activeValue}/5` : "Select a rating"}
            </span>
        </div>
    );
}

export default function ReviewForm({ productId, review, onSaved, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(review?.rating ?? 0);
    const [title, setTitle] = useState(review?.title ?? "");
    const [comment, setComment] = useState(review?.comment ?? "");
    const [loading, setLoading] = useState(false);

    const titleId = useId();
    const commentId = useId();

    async function submit(event: FormEvent) {
        event.preventDefault();

        if (rating === 0) {
            toast.error("Please select a rating between 1 and 5 stars.");
            return;
        }

        setLoading(true);
        try {
            if (review) {
                await graphqlClient.request(UPDATE_REVIEW, {
                    id: review.id,
                    input: { rating, title: title.trim(), comment: comment.trim() },
                });
            } else {
                await graphqlClient.request(CREATE_REVIEW, {
                    input: { productId, rating, title: title.trim(), comment: comment.trim() },
                });
            }
            await onSaved();
            toast.success(
                review
                    ? "Review updated and submitted for moderation."
                    : "Review submitted for moderation."
            );
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ??
                error?.message ??
                "Unable to save review. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="border-border/70 bg-card/70 shadow-xs backdrop-blur-sm">
            <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-serif text-base tracking-tight">
                            {review ? "Edit your review" : "Write a review"}
                        </CardTitle>
                        <CardDescription className="text-[11px]">
                            Share your feedback to help future buyers.
                        </CardDescription>
                    </div>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            disabled={loading}
                            className="rounded-lg text-xs h-7 px-2"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="px-4 sm:px-5 pb-4">
                <form onSubmit={submit} className="space-y-3.5">
                    <fieldset className="space-y-1" disabled={loading}>
                        <legend className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                            Rating <span className="text-destructive" aria-hidden="true">*</span>
                        </legend>
                        <StarRatingSelector value={rating} onChange={setRating} />
                    </fieldset>

                    <div className="space-y-1">
                        <label htmlFor={titleId} className="text-xs font-medium text-foreground">
                            Headline <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <Input
                            id={titleId}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            disabled={loading}
                            placeholder="What stood out the most?"
                            className="h-9 rounded-xl border-border/70 text-xs focus-visible:ring-primary/40"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor={commentId} className="text-xs font-medium text-foreground">
                            Detailed Review <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <Textarea
                            id={commentId}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={1000}
                            rows={3}
                            disabled={loading}
                            placeholder="How is the quality, sizing, material, or finish?"
                            className="resize-none rounded-xl border-border/70 text-xs focus-visible:ring-primary/40 leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onCancel}
                                disabled={loading}
                                className="rounded-xl h-8 text-xs"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            size="sm"
                            disabled={loading}
                            className="rounded-xl min-w-[110px] h-8 text-xs"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                    <span>Saving...</span>
                                </>
                            ) : review ? (
                                "Update Review"
                            ) : (
                                "Submit Review"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}