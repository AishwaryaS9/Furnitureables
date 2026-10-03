"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart";
import { useCartSync } from "@/hooks/useCartSync";
import { useWishlistSync } from "@/hooks/useWishlistSync";
import { useCartLiveSync } from "@/hooks/useCartLiveSync";

export default function AppSyncs() {
    const { user, isLoaded } = useUser();
    const userId = user?.id ?? null;

    const resetStore = useCartStore((s) => s.resetStore);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isLoaded && !userId) resetStore();
    }, [isLoaded, userId, resetStore]);

    const prevUserId = useRef<string | null | undefined>(undefined);
    useEffect(() => {
        if (!isLoaded) return;

        if (prevUserId.current === undefined) {
            prevUserId.current = userId;
            return;
        }

        if (prevUserId.current !== userId) {
            prevUserId.current = userId;
            queryClient.invalidateQueries({ queryKey: ["activePromotion"] });
        }
    }, [isLoaded, userId, queryClient]);

    useCartSync(userId);
    useCartLiveSync(userId);
    useWishlistSync(userId, isLoaded);

    return null;
}
