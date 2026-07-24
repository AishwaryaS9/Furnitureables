"use client";

import { useSyncGuestCart } from "@/hooks/useSyncGuestCart";

export default function CartSyncProvider() {
    useSyncGuestCart();

    return null;
}