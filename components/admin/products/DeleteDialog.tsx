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

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string | null;
    onConfirm: () => Promise<void> | void;
    loading?: boolean;
}

export default function DeleteDialog({ open, onOpenChange, title, onConfirm, loading = false }: DeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-3xl border-border/60 bg-card/95 backdrop-blur-xl shadow-xl max-w-md">
                <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-lg font-bold text-foreground">
                        Delete Product?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground">
                        Are you sure you want to delete{" "}
                        {title ? (
                            <span className="font-semibold text-foreground">"{title}"</span>
                        ) : (
                            "this product"
                        )}
                        ? This action cannot be undone and will remove the item from your catalog.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2 pt-2">
                    <AlertDialogCancel
                        className="h-9 px-4 text-xs font-medium rounded-xl border-border bg-card hover:bg-secondary cursor-pointer mt-0"
                        disabled={loading}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={loading}
                        className="h-9 px-4 text-xs font-semibold rounded-xl bg-destructive text-background hover:bg-destructive/80 cursor-pointer"
                    >
                        {loading ? "Deleting..." : "Delete Product"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}