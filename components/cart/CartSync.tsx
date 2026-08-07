"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/hooks/useCart";
import { useSaveCart } from "@/hooks/useSaveCart";
import { useCartStore } from "@/store/cart";
import { mergeCart } from "@/lib/mergeCart";
import { mapServerCartItems } from "@/lib/cartMapper";

export default function CartSync() {
    const { user } = useUser();

    const { data: cart } = useCart(user?.id);

    const saveCart = useSaveCart();

    const syncedUserId = useCartStore((s) => s.syncedUserId);
    const setSyncedUserId = useCartStore((s) => s.setSyncedUserId);
    const setCart = useCartStore((s) => s.setCart);

    const syncing = useRef(false);

    useEffect(() => {
        async function syncCart() {
            if (!user) return;
            if (!cart) return;

            if (syncedUserId === user.id) return;
            if (syncing.current) return;

            syncing.current = true;

            try {
                const serverItems = mapServerCartItems(cart.items);
                const guestItems = useCartStore.getState().items;

                const merged = mergeCart(guestItems, serverItems);
                setCart(merged);

                setSyncedUserId(user.id);
                await saveCart.mutateAsync(
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
    }, [
        user,
        cart,
        syncedUserId,
        saveCart,
        setCart,
        setSyncedUserId,
    ]);

    return null;
}