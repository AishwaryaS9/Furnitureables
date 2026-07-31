"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { graphqlClient } from "@/lib/graphql/client";
import { CANCEL_ORDER } from "@/lib/graphql/mutations";
import { Order, CancelOrderResponse } from "@/types/order";
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
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { BUY_AGAIN } from "@/lib/graphql/mutations";
import { BuyAgainResponse } from "@/types/order";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useHydrateCart } from "@/hooks/useHydrateCart";
import Link from "next/link";

interface Props {
    order: Order;
}

export default function OrderActions({
    order,
}: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const hydrateCart = useHydrateCart();
    const { user } = useUser();

    const [loading, setLoading] = useState(false);
    const [buyAgainLoading, setBuyAgainLoading] = useState(false);

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
            toast.success("Order cancelled successfully.");
        } catch (error) {
            toast.error("Unable to cancel order.");
        } finally {
            setLoading(false);
        }
    }

    async function handleBuyAgain() {
        try {
            setBuyAgainLoading(true);

            await graphqlClient.request<BuyAgainResponse>(
                BUY_AGAIN,
                {
                    orderId: order.id,
                }
            );

            await queryClient.invalidateQueries({
                queryKey: ["cart", user?.id],
            });

            await hydrateCart();

            router.push("/cart");
        } finally {
            setBuyAgainLoading(false);
        }
    }

    if (order.status !== "CONFIRMED") {
        return null;
    }

    return (
        <div className="flex items-center justify-end gap-3">
            <Button
                variant="outline"
                onClick={handleBuyAgain}
                disabled={buyAgainLoading}
            >
                {buyAgainLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                )}

                Buy Again
            </Button>

            <Link href={`/orders/${order.id}/invoice`}>
                <Button variant="outline">
                    View Invoice
                </Button>
            </Link>

            <AlertDialog>
                <AlertDialogTrigger className="p-1 bg-red-300 rounded-md">
                    Cancel Order
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Cancel this order?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This action cannot be undone.
                            The order will be cancelled and the reserved stock
                            will be restored.
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
