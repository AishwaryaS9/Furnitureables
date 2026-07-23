"use client";

import { useEffect, useState } from "react";
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

    async function toggleWishlist() {
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
                await queryClient.invalidateQueries({
                    queryKey: ["wishlist"],
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="outline"
            size={size}
            onClick={toggleWishlist}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Heart
                    className={`h-4 w-4 transition-colors ${wishlisted
                        ? "fill-red-500 text-red-500"
                        : ""
                        }`}
                />
            )}
        </Button>
    );
}