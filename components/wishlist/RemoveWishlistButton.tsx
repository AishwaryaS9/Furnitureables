"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { graphqlClient } from "@/lib/graphql/client";
import { REMOVE_FROM_WISHLIST } from "@/lib/graphql/mutations";
import { RemoveFromWishlistResponse } from "@/types/wishlist";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
    productId: string;
}

export default function RemoveWishlistButton({ productId }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);

    async function handleRemove(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;

        try {
            setLoading(true);

            await graphqlClient.request<RemoveFromWishlistResponse>(
                REMOVE_FROM_WISHLIST,
                {
                    productId,
                }
            );

            await queryClient.invalidateQueries({
                queryKey: ["wishlist"],
            });

            toast.success("Item removed from your wishlist.");
            router.refresh();
        } catch (error) {
            console.error("Failed to remove item from wishlist:", error);
            toast.error("Failed to remove item. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleRemove}
            disabled={loading}
            aria-label="Remove item from wishlist"
            className="h-8 w-8 rounded-xl border-input bg-card/80 backdrop-blur-md shadow-xs hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
            {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
                <Trash2 className="h-3.5 w-3.5 transition-colors" aria-hidden="true" />
            )}
        </Button>
    );
}