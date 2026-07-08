"use client";

import { useCartStore } from "@/store/cart";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20">

        <header className="border-b border-zinc-200/60 pb-6 mb-10 flex items-baseline justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight font-serif">Your Cart</h1>
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
              Review your architectural collections itemization ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Continue Shopping</span>
          </Link>
        </header>

        {items.length === 0 ? (
          <div className="text-center py-28 border border-dashed border-zinc-200 rounded-3xl p-12 bg-white max-w-lg mx-auto space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 mx-auto shadow-2xs">
              <ShoppingBag className="w-6 h-6 stroke-[1.25]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-medium tracking-tight text-zinc-950">Your cart is empty</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed font-light">
                You haven't added any signature items to your order matrix showroom queue yet.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-zinc-900 text-white text-xs font-semibold tracking-widest uppercase hover:bg-zinc-800 transition-all shadow-xs"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-start">

            {/* Left Column */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white border border-zinc-200/60 rounded-2xl px-6 py-2 divide-y divide-zinc-100 shadow-2xs">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 xl:col-span-4">
              <OrderSummary />

              <div className="mt-4 text-center sm:hidden">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-950 transition-colors py-2"
                >
                  <ArrowLeft size={12} />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}