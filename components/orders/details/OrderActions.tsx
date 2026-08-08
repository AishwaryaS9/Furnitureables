"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart, FileText } from "lucide-react";
import { graphqlClient } from "@/lib/graphql/client";
import { BUY_AGAIN } from "@/lib/graphql/mutations";
import { Order, BuyAgainResponse } from "@/types/order";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useHydrateCart } from "@/hooks/useHydrateCart";
import CancelOrderDialog from "./CancelOrderDialog";

interface Props {
    order: Order;
}

export default function OrderActions({ order }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const hydrateCart = useHydrateCart();
    const { user } = useUser();

    const [buyAgainLoading, setBuyAgainLoading] = useState(false);

    async function handleBuyAgain() {
        try {
            setBuyAgainLoading(true);

            await graphqlClient.request<BuyAgainResponse>(BUY_AGAIN, {
                orderId: order.id,
            });

            await queryClient.invalidateQueries({
                queryKey: ["cart", user?.id],
            });

            await hydrateCart();

            router.push("/cart");
        } catch {
            toast.error("Unable to reorder items.");
            setBuyAgainLoading(false);
        }
    }

    const isCancelable = order.status === "CONFIRMED";

    return (
        <div
            aria-label="Order actions toolbar"
            className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-3 w-full"
        >
            {/* Buy Again Action */}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBuyAgain}
                disabled={buyAgainLoading}
                className="h-9 px-4 text-xs font-semibold rounded-xl border-border bg-card hover:bg-secondary transition-all cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
                {buyAgainLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden="true" />
                ) : (
                    <ShoppingCart className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                )}
                <span>Buy Again</span>
            </Button>

            {/* Invoice Link Wrapper */}
            <Link
                href={`/orders/${order.id}/invoice`}
                aria-label="View official tax invoice receipt"
                className="inline-flex"
            >
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 text-xs font-semibold rounded-xl border-border bg-card hover:bg-secondary transition-all cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>View Invoice</span>
                </Button>
            </Link>

            {/* Extracted Cancel Order Dialog Component */}
            {isCancelable && (
                <CancelOrderDialog
                    orderId={order.id}
                    orderNumber={order.orderNumber}
                />
            )}
        </div>
    );
}