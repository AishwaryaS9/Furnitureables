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
import { Coupon } from "@/types/coupon";

interface DeleteCouponDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    coupon?: Coupon | null;
    isLoading?: boolean;
}

export default function DeleteCouponDialog({ open, onOpenChange, onConfirm, coupon, isLoading = false }: DeleteCouponDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent
                role="alertdialog"
                aria-labelledby="delete-coupon-title"
                aria-describedby="delete-coupon-description"
                className="rounded-2xl border-border bg-card p-6 shadow-lg sm:max-w-md"
            >
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
                    <AlertDialogTitle id="delete-coupon-title" className="font-serif text-lg font-normal text-foreground">
                        Delete Coupon?
                    </AlertDialogTitle>
                    <AlertDialogDescription id="delete-coupon-description" className="text-xs text-muted-foreground font-light leading-relaxed">
                        Are you sure you want to permanently remove this coupon? This action cannot be undone, and the code will stop working immediately.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {coupon && (
                    <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs space-y-1 my-1">
                        <p className="font-mono font-semibold text-foreground truncate">
                            {coupon.code}
                        </p>
                        <p className="text-muted-foreground">
                            {coupon.campaignName || coupon.description || "General offer"}
                        </p>
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
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        aria-label={coupon ? `Confirm deletion of coupon ${coupon.code}` : "Confirm deletion of coupon"}
                        className="h-9 px-4 text-xs font-semibold rounded-xl bg-destructive text-background hover:bg-destructive/80 cursor-pointer"
                    >
                        {isLoading ? "Deleting..." : "Delete Coupon"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
