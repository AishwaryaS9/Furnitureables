"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/hooks/useCart";
import { useSaveCart } from "@/hooks/useSaveCart";
import { useCartStore } from "@/store/cart";
import { mergeCart } from "@/lib/mergeCart";

export default function CartSync() {
    const { user } = useUser();

    const { data: cart } = useCart(user?.id);

    const saveCart = useSaveCart();

    const syncedUserId = useCartStore((s) => s.syncedUserId);
    const setSyncedUserId = useCartStore((s) => s.setSyncedUserId);
    const setCart = useCartStore((s) => s.setCart);

    useEffect(() => {
        if (!user) return;
        if (!cart) return;

        if (syncedUserId === user.id) return;

        const serverItems = cart.items.map((item) => ({
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            image: item.product.media[0]?.url,
            quantity: item.quantity,
        }));

        const guestItems = useCartStore.getState().items;

        const merged = mergeCart(guestItems, serverItems);

        setCart(merged);

        setSyncedUserId(user.id);

        saveCart.mutate(
            merged.map((i) => ({
                productId: i.id,
                quantity: i.quantity,
            }))
        );
    }, [user, cart, syncedUserId, saveCart, setCart, setSyncedUserId]);

    return null;
}