"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";

export default function CartLogoutProvider() {

    const { user } = useUser();

    const clearCart = useCartStore((s) => s.clearCart);

    const setSyncedUserId = useCartStore(
        (s) => s.setSyncedUserId
    );

    useEffect(() => {

        if (!user) {

            clearCart();

            setSyncedUserId(null);

        }

    }, [user]);

    return null;
}