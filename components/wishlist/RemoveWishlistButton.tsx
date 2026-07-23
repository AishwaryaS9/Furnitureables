"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { graphqlClient } from "@/lib/graphql/client";
import { REMOVE_FROM_WISHLIST } from "@/lib/graphql/mutations";
import { RemoveFromWishlistResponse } from "@/types/wishlist";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
    productId: string;
}

export default function RemoveWishlistButton({
    productId,
}: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);

    async function handleRemove() {
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
            router.refresh();
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
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    );
}