"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";

export default function CartLogoutSync() {
    const { user, isLoaded } = useUser();

    const resetStore = useCartStore((s) => s.resetStore);

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            resetStore();
        }
    }, [user, isLoaded, resetStore]);

    return null;
}