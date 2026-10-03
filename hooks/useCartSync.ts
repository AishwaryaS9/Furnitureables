"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/hooks/useCart";
import { useSaveCart } from "@/hooks/useSaveCart";
import { useCartStore } from "@/store/cart";
import { mergeCart } from "@/lib/mergeCart";
import { mapServerCartItems } from "@/lib/cartMapper";

export function useCartSync(userId?: string | null) {
    const { data: cart } = useCart(userId ?? undefined);
    const { mutateAsync: saveCart } = useSaveCart();

    const syncedUserId = useCartStore((s) => s.syncedUserId);
    const setSyncedUserId = useCartStore((s) => s.setSyncedUserId);
    const setCart = useCartStore((s) => s.setCart);

    const syncing = useRef(false);

    useEffect(() => {
        async function syncCart() {
            if (!userId || !cart) return;
            if (syncedUserId === userId) return;
            if (syncing.current) return;

            syncing.current = true;

            try {
                const serverItems = mapServerCartItems(cart.items);
                const guestItems = useCartStore.getState().items;

                const merged = mergeCart(guestItems, serverItems);
                setCart(merged);
                setSyncedUserId(userId);

                await saveCart(
                    merged.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                    }))
                );
            } catch (error) {
                console.error("Cart sync failed:", error);
                setSyncedUserId(null);
            } finally {
                syncing.current = false;
            }
        }

        syncCart();
    }, [userId, cart, syncedUserId, saveCart, setCart, setSyncedUserId]);
}
