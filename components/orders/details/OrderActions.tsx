"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { graphqlClient } from "@/lib/graphql/client";
import { CANCEL_ORDER } from "@/lib/graphql/mutations";
import { Order, CancelOrderResponse } from "@/types/order";
import { Button } from "@/components/ui/button";
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

interface Props {
    order: Order;
}

export default function OrderActions({
    order,
}: Props) {
    const router = useRouter();

    const [loading, setLoading] =
        useState(false);

    async function handleCancel() {
        try {
            setLoading(true);

            await graphqlClient.request<CancelOrderResponse>(
                CANCEL_ORDER,
                {
                    id: order.id,
                }
            );

            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    if (order.status !== "CONFIRMED") {
        return null;
    }

    return (
        <div className="flex justify-end">
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button variant="destructive">
                        Cancel Order
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Cancel this order?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This action cannot be undone.
                            The order will be cancelled
                            and the reserved stock will
                            be restored.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Keep Order
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}

                            Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}