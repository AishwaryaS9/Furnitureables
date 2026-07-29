"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";
import { useSaveCart } from "@/hooks/useSaveCart";

export default function CartLiveSync() {
    const { user } = useUser();

    const items = useCartStore((s) => s.items);
    const syncedUserId = useCartStore((s) => s.syncedUserId);

    const saveCart = useSaveCart();

    const previousPayload = useRef("");

    useEffect(() => {
        if (!user) return;

        if (syncedUserId !== user.id) return;

        if (saveCart.isPending) return;

        const payload = items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }));

        const serialized = JSON.stringify(payload);

        if (serialized === previousPayload.current) return;

        previousPayload.current = serialized;

        saveCart.mutate(payload);
    }, [items, user, syncedUserId, saveCart]);

    return null;
}