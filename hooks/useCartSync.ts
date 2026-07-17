"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";
import { useSaveCart } from "./useSaveCart";

export function useCartSync() {
    const { user, isLoaded } = useUser();

    const items = useCartStore((s) => s.items);
    const cartReady = useCartStore((s) => s.cartReady);

    const saveCart = useSaveCart();
    const previousPayload = useRef<string>("");

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) return;

        if (!cartReady) return;

        const payload = items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }));

        const serialized = JSON.stringify(payload);

        if (serialized === previousPayload.current) {
            return;
        }

        previousPayload.current = serialized;

        console.log("Active session mutation triggered - updating remote DB:", payload);
        saveCart.mutate(payload);

    }, [
        isLoaded,
        user,
        cartReady,
        items,
        saveCart,
    ]);
}



