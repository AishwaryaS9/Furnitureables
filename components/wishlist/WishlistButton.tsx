"use client";

import { useEffect, useState, MouseEvent } from "react";
import { Heart, Loader2 } from "lucide-react";
import { graphqlClient } from "@/lib/graphql/client";
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "@/lib/graphql/mutations";
import { AddToWishlistResponse, RemoveFromWishlistResponse } from "@/types/wishlist";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface Props {
    productId: string;
    isWishlisted?: boolean;
    size?: "icon" | "sm" | "default";
}

export default function WishlistButton({
    productId,
    isWishlisted = false,
    size = "icon",
}: Props) {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const { openSignIn } = useClerk();

    const [loading, setLoading] = useState(false);
    const [wishlisted, setWishlisted] = useState(isWishlisted);

    useEffect(() => {
        setWishlisted(isWishlisted);
    }, [isWishlisted]);

    async function toggleWishlist(e: MouseEvent<HTMLButtonElement>) {
        // Prevent triggering parent Link elements or card click events
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.info("Please sign in to add items to your wishlist.");
            openSignIn();
            return;
        }

        try {
            setLoading(true);

            if (wishlisted) {
                await graphqlClient.request<RemoveFromWishlistResponse>(
                    REMOVE_FROM_WISHLIST,
                    {
                        productId,
                    }
                );

                setWishlisted(false);
                toast.success("Item removed from your wishlist.");
                await queryClient.invalidateQueries({
                    queryKey: ["wishlist"],
                });
            } else {
                await graphqlClient.request<AddToWishlistResponse>(
                    ADD_TO_WISHLIST,
                    {
                        productId,
                    }
                );

                setWishlisted(true);
                toast.success("Item added to your wishlist.");
                await queryClient.invalidateQueries({
                    queryKey: ["wishlist"],
                });
            }
        } catch (error) {
            toast.error("Failed to update wishlist. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const ariaLabel = wishlisted
        ? "Remove from wishlist"
        : "Add to wishlist";

    return (
        <Button
            variant="outline"
            size={size}
            onClick={toggleWishlist}
            disabled={loading}
            aria-label={ariaLabel}
            aria-pressed={wishlisted}
            className="rounded-xl border-input bg-white backdrop-blur-md shadow-xs hover:bg-secondary hover:text-foreground transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
                <Heart
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform duration-200 ${wishlisted
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                />
            )}
        </Button>
    );
}