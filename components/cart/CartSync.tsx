"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

import { useCartStore } from "@/store/cart";
import { mergeCart } from "@/lib/mergeCart";
import { useCart } from "@/hooks/useCart";
import { useSaveCart } from "@/hooks/useSaveCart";
import { useQueryClient } from "@tanstack/react-query";

const SYNC_DEBOUNCE_MS = 500;

export default function CartSync() {
    const { user, isLoaded } = useUser();
    const { data: cart, isLoading } = useCart(user?.id);
    const saveCart = useSaveCart();

    const initializedUser = useRef<string | null>(null);
    const previousPayload = useRef<string>("");
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const queryClient = useQueryClient();
    const items = useCartStore((s) => s.items);
    const cartReady = useCartStore((s) => s.cartReady);
    const syncedUserId = useCartStore((s) => s.syncedUserId);
    const setCart = useCartStore((s) => s.setCart);
    const setCartReady = useCartStore((s) => s.setCartReady);
    const setSyncedUserId = useCartStore((s) => s.setSyncedUserId);

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            if (initializedUser.current !== null) {
                console.log("Logout detected - clearing local cart + cache");
                useCartStore.setState({
                    items: [],
                    cartReady: true,
                    syncedUserId: null,
                });
                queryClient.removeQueries({ queryKey: ["cart"] });
            } else if (!cartReady) {
                setCartReady(true);
            }
            initializedUser.current = null;
            previousPayload.current = "";
            return;
        }
        // --- LOGGED-IN ---
        if (isLoading || !cart) return;
        if (initializedUser.current === user.id) return;

        initializedUser.current = user.id;

        const serverItems = cart.items.map((item) => ({
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            image: item.product.media[0]?.url ?? "/images/placeholder.jpg",
            quantity: item.quantity,
        }));

        if (syncedUserId === user.id) {
            console.log("Already synced for this user - loading server cart as-is");
            setCart(serverItems);
            setCartReady(true);
            previousPayload.current = JSON.stringify(
                serverItems.map((i) => ({ productId: i.id, quantity: i.quantity }))
            );
            return;
        }

        const guestItems = useCartStore.getState().items;
        console.log("Login Handshake - merging:", { guestItems, serverItems });

        const merged = mergeCart(guestItems, serverItems);

        setCart(merged);
        setCartReady(true);
        setSyncedUserId(user.id);

        const baselinePayload = merged.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }));
        previousPayload.current = JSON.stringify(baselinePayload);

        saveCart.mutate(baselinePayload, {
            onError: () => console.error("Login merge save failed"),
        });
    }, [isLoaded, user, cart, isLoading, cartReady, syncedUserId, setCart, setCartReady, setSyncedUserId, saveCart]);

    useEffect(() => {
        if (!isLoaded || !user || !cartReady) return;

        const payload = items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }));
        const serialized = JSON.stringify(payload);

        if (serialized === previousPayload.current) return;

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            previousPayload.current = serialized;
            saveCart.mutate(payload);
        }, SYNC_DEBOUNCE_MS);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [isLoaded, user, cartReady, items, saveCart]);

    return null;
}