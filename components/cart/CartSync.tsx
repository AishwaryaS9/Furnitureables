"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";

export default function CartSync() {
    const { user, isLoaded } = useUser();

    const items = useCartStore((s) => s.items);
    const clearCart = useCartStore((s) => s.clearCart);
    const mergeCart = useCartStore((s) => s.mergeCart);
    const setCart = useCartStore((s) => s.setCart);

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            clearCart();
            return;
        }

        async function syncCart() {
            // Fetch user's cart from DB
            const res = await fetch("/api/cart");
            const dbCart = await res.json();

            // Merge DB cart into Zustand store
            mergeCart(dbCart);

            // At this point, the Zustand store has been updated,
            // but you don't have the merged array to send back to the API.

            // If needed, you can read the latest state:
            const merged = useCartStore.getState().items;

            // Save merged cart back to DB
            await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(merged),
            });

            // Optional: setCart isn't needed here because mergeCart
            // has already updated the store.
            // setCart(merged);
        }

        syncCart();
    }, [user, isLoaded, clearCart, mergeCart]);

    return null;
}