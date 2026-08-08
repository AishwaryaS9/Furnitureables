"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphql/client";
import { CANCEL_ORDER } from "@/lib/graphql/mutations";
import { CancelOrderResponse } from "@/types/order";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CancelOrderDialogProps {
    orderId: string;
    orderNumber: string;
}

export default function CancelOrderDialog({
    orderId,
    orderNumber,
}: CancelOrderDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleCancel() {
        try {
            setLoading(true);

            await graphqlClient.request<CancelOrderResponse>(CANCEL_ORDER, {
                id: orderId,
            });

            router.refresh();
            toast.success("Order cancelled successfully.");
        } catch {
            toast.error("Unable to cancel order. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger
                type="button"
                className="h-9 px-4 text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10 transition-all cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap border-0 bg-transparent"
            >
                <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Cancel Order</span>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-2xl border-border bg-card p-6 shadow-lg sm:max-w-md">
                <AlertDialogCancel
                    type="button"
                    aria-label="Close dialog"
                    className="absolute right-4 top-4 h-8 w-8 rounded-full border-0 p-0 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer inline-flex items-center justify-center transition-colors mt-0"
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </AlertDialogCancel>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-serif text-lg font-normal text-foreground">
                        Cancel Order #{orderNumber}?
                    </AlertDialogTitle>
                    {/* <AlertDialogTitle className="text-base font-semibold tracking-tight text-foreground">
                        Cancel Order #{orderNumber}?
                    </AlertDialogTitle> */}
                    <AlertDialogDescription className="text-xs text-muted-foreground font-light leading-relaxed">
                        This action cannot be undone. The order will be permanently cancelled and any reserved stock will be restored to inventory.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4 flex flex-row items-center justify-end gap-2">
                    <AlertDialogCancel className="h-9 px-4 text-xs font-medium rounded-xl border-border bg-card hover:bg-secondary cursor-pointer mt-0">
                        Keep Order
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                        }}
                        disabled={loading}
                        className="h-9 px-4 text-xs font-semibold rounded-xl bg-destructive text-background hover:bg-destructive/80 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                <span>Cancelling...</span>
                            </>
                        ) : (
                            <span>Confirm Cancellation</span>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}