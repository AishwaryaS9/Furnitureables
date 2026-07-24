"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";
import { useSaveCart } from "./useSaveCart";
import { useQueryClient } from "@tanstack/react-query";

export function useSyncGuestCart() {
    const { user } = useUser();

    const queryClient = useQueryClient();

    const saveCart = useSaveCart();

    const items = useCartStore((s) => s.items);

    const clearCart = useCartStore((s) => s.clearCart);

    const syncedUserId = useCartStore((s) => s.syncedUserId);

    const setSyncedUserId = useCartStore((s) => s.setSyncedUserId);

    useEffect(() => {

        if (!user) return;

        if (items.length === 0) return;

        if (syncedUserId === user.id) return;

        saveCart.mutate(
            items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            })),
            {
                onSuccess: async () => {

                    clearCart();

                    setSyncedUserId(user.id);

                    await queryClient.invalidateQueries({
                        queryKey: ["cart", user.id],
                    });

                },
            }
        );

    }, [
        user,
        items,
        syncedUserId,
        saveCart,
        clearCart,
        setSyncedUserId,
        queryClient,
    ]);
}