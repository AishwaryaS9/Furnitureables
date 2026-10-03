"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart";
import { useSaveCart } from "@/hooks/useSaveCart";

export function useCartLiveSync(userId?: string | null) {
    const items = useCartStore((s) => s.items);
    const syncedUserId = useCartStore((s) => s.syncedUserId);

    const { mutate, isPending } = useSaveCart();

    const initialized = useRef(false);
    const previousPayload = useRef("");

    useEffect(() => {
        if (!userId) return;
        if (syncedUserId !== userId) return;

        if (!initialized.current) {
            initialized.current = true;
            return;
        }

        if (isPending) return;

        const payload = items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }));

        const serialized = JSON.stringify(payload);
        if (serialized === previousPayload.current) return;

        previousPayload.current = serialized;
        mutate(payload);
    }, [items, userId, syncedUserId, isPending, mutate]);
}
