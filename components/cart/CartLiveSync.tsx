"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";
import { useSaveCart } from "@/hooks/useSaveCart";

export default function CartLiveSync() {
    const { user } = useUser();

    const items = useCartStore((s) => s.items);

    const saveCart = useSaveCart();

    const previous = useRef("");

    useEffect(() => {
        if (!user) return;

        const payload = items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
        }));

        const serialized = JSON.stringify(payload);

        if (serialized === previous.current) return;

        previous.current = serialized;

        saveCart.mutate(payload);
    }, [items, user, saveCart]);

    return null;
}