"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import { useState, MouseEvent } from "react";
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

export default function MoveToCartButton({ product }: Props) {
    const queryClient = useQueryClient();
    const addToCart = useAddToCart();
    const [loading, setLoading] = useState(false);

    const isOutOfStock = product.stock <= 0;

    async function handleMove(e: MouseEvent<HTMLButtonElement>) {
        // Prevent triggering parent link or card click events
        e.preventDefault();
        e.stopPropagation();

        if (loading || isOutOfStock) return;

        try {
            setLoading(true);

            addToCart(product);

            // Remove item from wishlist
            await graphqlClient.request<RemoveFromWishlistResponse>(
                REMOVE_FROM_WISHLIST,
                {
                    productId: product.id,
                }
            );

            await queryClient.invalidateQueries({
                queryKey: ["wishlist"],
            });

            toast.success(`${product.title} moved to your cart.`);
        } catch (error) {
            console.error("Failed to move product to cart:", error);
            toast.error("Failed to move product to cart. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const ariaLabel = isOutOfStock
        ? `${product.title} is currently out of stock`
        : `Move ${product.title} to your shopping cart`;

    return (
        <Button
            onClick={handleMove}
            disabled={loading || isOutOfStock}
            aria-label={ariaLabel}
            className="w-full h-10 px-4 text-xs font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
            {loading ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
                <ShoppingCart className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
            )}

            <span>{isOutOfStock ? "Out of Stock" : "Move to Cart"}</span>
        </Button>
    );
}