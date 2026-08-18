"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";

interface DeleteReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    review?: Review | null;
    isLoading?: boolean;
}

export default function DeleteReviewDialog({ open, onOpenChange, onConfirm, review, isLoading = false }: DeleteReviewDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl border-border bg-card p-6 shadow-lg sm:max-w-md">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                    aria-label="Close dialog"
                    className="absolute right-4 top-4 h-8 w-8 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                >
                    <X className="h-4 w-4 stroke-2" aria-hidden="true" />
                </Button>

                <AlertDialogHeader>
                    <AlertDialogTitle className="font-serif text-lg font-normal text-foreground">
                        Delete Customer Review?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs text-muted-foreground font-light leading-relaxed">
                        Are you sure you want to permanently remove this review? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {review && (
                    <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs space-y-1 my-1">
                        <p className="font-medium text-foreground truncate">
                            {review.product.title}
                        </p>
                        <p className="text-muted-foreground">
                            by {review.author.name} · {review.rating} / 5 stars
                        </p>
                        {review.comment && (
                            <p className="text-muted-foreground/90 italic line-clamp-2 pt-1 border-t border-border/40 mt-1">
                                "{review.comment}"
                            </p>
                        )}
                    </div>
                )}

                <AlertDialogFooter className="mt-4 flex flex-row items-center justify-end gap-2">
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="h-9 px-4 text-xs font-medium rounded-xl border-border bg-card hover:bg-secondary cursor-pointer mt-0"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className="h-9 px-4 text-xs font-semibold rounded-xl bg-destructive text-background hover:bg-destructive/80 cursor-pointer"
                    >
                        {isLoading ? "Deleting..." : "Delete Review"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}