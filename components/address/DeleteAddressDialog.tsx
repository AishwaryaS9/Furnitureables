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
import { Button } from "../ui/button";

interface DeleteAddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    isLoading?: boolean;
}

export default function DeleteAddressDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
}: DeleteAddressDialogProps) {
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
                        Delete Delivery Address?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs text-muted-foreground font-light leading-relaxed">
                        Are you sure you want to remove this location from your address book? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

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
                        {isLoading ? "Deleting..." : "Delete Address"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}