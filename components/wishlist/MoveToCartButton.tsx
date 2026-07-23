"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { graphqlClient } from "@/lib/graphql/client";
import { REMOVE_FROM_WISHLIST } from "@/lib/graphql/mutations";
import { Product } from "@/types/product";
import { RemoveFromWishlistResponse } from "@/types/wishlist";
import { useAddToCart } from "@/hooks/useAddToCart";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
    product: Product;
}

export default function MoveToCartButton({
    product,
}: Props) {
    const queryClient = useQueryClient();
    const addToCart = useAddToCart();
    const [loading, setLoading] = useState(false);

    async function handleMove() {
        if (loading) return;

        try {
            setLoading(true);

            addToCart(product);

            // Remove from wishlist
            await graphqlClient.request<RemoveFromWishlistResponse>(
                REMOVE_FROM_WISHLIST,
                {
                    productId: product.id,
                }
            );
            await queryClient.invalidateQueries({
                queryKey: ["wishlist"],
            });
            toast.success("Item moved to your cart.");

        } catch (error) {
            console.error("Failed to move product to cart:", error);

            toast.error("Failed to move product to cart.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <Button
            className="flex-1"
            onClick={handleMove}
            disabled={loading || product.stock <= 0}
        >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
            )}

            {product.stock <= 0
                ? "Out of Stock"
                : "Move to Cart"}
        </Button>
    );
}