"use client";

import { useCartStore } from "@/store/cart";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background transition-colors duration-200"
    >
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">

        {/* Header Section */}
        <header className="border-b border-border/60 pb-6 mb-8 sm:mb-10 flex flex-row items-center justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-foreground truncate">
              Your Cart
            </h1>
            <p
              role="status"
              aria-live="polite"
              className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-widest truncate"
            >
              Review your items ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            // asChild
            className="h-auto p-0 hover:bg-transparent text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            <Link
              href="/products"
              aria-label="Return to catalog and continue shopping"
              className="inline-flex flex-row items-center gap-1.5 sm:gap-2 whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Continue Shopping</span>
            </Link>
          </Button>
        </header>

        {/* Empty State */}
        {items.length === 0 ? (
          <section
            role="region"
            aria-label="Empty cart notification"
            className="text-center py-16 sm:py-24 border border-dashed border-border rounded-3xl p-6 sm:p-12 bg-card/60 backdrop-blur-xs max-w-lg mx-auto space-y-6 shadow-xs"
          >
            <div
              className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center text-muted-foreground mx-auto shadow-xs"
              aria-hidden="true"
            >
              <ShoppingBag className="w-7 h-7 stroke-[1.25]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                Your cart is empty
              </h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed font-light">
                You haven't added any signature items to your order matrix showroom queue yet.
              </p>
            </div>

            <div className="pt-2">
              <Button
                // asChild
                className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
              >
                <Link href="/products" className="inline-flex items-center gap-2 group">
                  <span>Explore Collections</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </section>
        ) : (
          /* Active Cart Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 lg:items-start">

            {/* Left Column: Itemized Cart Feed */}
            <section
              aria-label="Shopping cart items"
              className="lg:col-span-7 xl:col-span-8 bg-card border border-border/60 rounded-2xl px-4 sm:px-6 py-2 divide-y divide-border/60 shadow-xs"
            >
              <ul className="divide-y divide-border/60 list-none p-0 m-0">
                {items.map((item) => (
                  <li key={item.id} className="py-2">
                    <CartItem item={item} />
                  </li>
                ))}
              </ul>
            </section>

            {/* Right Column: Checkout Summary Panel */}
            <aside
              aria-label="Order summary and checkout"
              className="lg:col-span-5 xl:col-span-4 space-y-4"
            >
              <CartSummary />
            </aside>

          </div>
        )}

      </div>
    </main>
  );
}