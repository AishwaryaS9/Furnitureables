"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";
import { useSaveCart } from "@/hooks/useSaveCart";

export default function CartLiveSync() {
    const { user } = useUser();

    const items = useCartStore((s) => s.items);
    const syncedUserId = useCartStore((s) => s.syncedUserId);

    const { mutate, isPending } = useSaveCart();

    const initialized = useRef(false);
    const previousPayload = useRef("");

    useEffect(() => {
        if (!user) return;

        if (syncedUserId !== user.id) return;

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

        // Don't sync identical payloads.
        if (serialized === previousPayload.current) return;

        previousPayload.current = serialized;

        mutate(payload);
    }, [items, user, syncedUserId, isPending, mutate]);

    return null;
}