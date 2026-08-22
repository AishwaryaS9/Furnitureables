"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

export function PromotionAuthSync() {
    const { userId, isLoaded } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isLoaded) return;

        queryClient.invalidateQueries({
            queryKey: ["activePromotion"],
        });
    }, [userId, isLoaded, queryClient]);

    return null;
}