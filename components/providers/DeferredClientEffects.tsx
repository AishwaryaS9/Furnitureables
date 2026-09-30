"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Background sync effects (cart, wishlist, promotions). None of them render
 * UI, so they don't need to be part of the initial bundle or compete with
 * hydration. Each one is code-split with next/dynamic and only mounted once
 * the browser is idle.
 */
const CartLogoutSync = dynamic(() => import("@/components/cart/CartLogoutSync"), { ssr: false });
const CartSync = dynamic(() => import("@/components/cart/CartSync"), { ssr: false });
const CartLiveSync = dynamic(() => import("@/components/cart/CartLiveSync"), { ssr: false });
const WishlistSync = dynamic(() => import("@/components/wishlist/WishlistSync"), { ssr: false });
const PromotionAuthSync = dynamic(
    () =>
        import("@/components/admin/coupons/PromotionAuthSync").then(
            (m) => m.PromotionAuthSync
        ),
    { ssr: false }
);

export default function DeferredClientEffects() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if ("requestIdleCallback" in window) {
            const id = window.requestIdleCallback(() => setReady(true), { timeout: 1500 });
            return () => window.cancelIdleCallback(id);
        }
        // Safari has no requestIdleCallback.
        const id = setTimeout(() => setReady(true), 300);
        return () => clearTimeout(id);
    }, []);

    if (!ready) return null;

    return (
        <>
            <CartLogoutSync />
            <CartSync />
            <CartLiveSync />
            <WishlistSync />
            <PromotionAuthSync />
        </>
    );
}
