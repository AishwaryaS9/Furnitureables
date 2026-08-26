"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";

type CartItemProps = {
  item: {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
    material?: string;
    color?: string;
  };
};

export default function CartItem({ item }: CartItemProps) {

  const incrementQuantity = useCartStore((s) => s.incrementQuantity);
  const decrementQuantity = useCartStore((s) => s.decrementQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const handleDecrease = () => {
    decrementQuantity(item.id);
  };

  const handleIncrease = () => {
    incrementQuantity(item.id);
  };

  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex items-start gap-3 sm:gap-6 py-6 border-b border-border last:border-0 group animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Product Image Panel */}
      <Link
        href={`/products/${item.id}`}
        aria-label={`View details for ${item.title}`}
        className="relative w-16 h-20 sm:w-24 sm:h-30 rounded-xl overflow-hidden bg-muted border border-border shrink-0 block focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-foreground"
      >
        <Image
          src={item.image || "/images/placeholder.jpg"}
          alt={item.title}
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>

      {/* Details block */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="min-w-0 text-sm font-medium text-foreground font-serif">
              <Link
                href={`/products/${item.id}`}
                className="truncate block hover:text-muted-foreground transition-colors focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-foreground rounded-sm"
              >
                {item.title}
              </Link>
            </h3>
            <span
              className="text-sm font-semibold text-foreground tabular-nums pl-2 shrink-0"
              aria-label={`Line total: $${lineTotal.toLocaleString()} for ${item.quantity} ${item.quantity === 1 ? "item" : "items"}`}
            >
              ₹{lineTotal.toLocaleString()}
            </span>
          </div>

          {(item.material || item.color) && (
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {[item.material, item.color].filter(Boolean).join(" / ")}
            </p>
          )}
          <p className="text-xs text-muted-foreground font-light">
            ₹{item.price.toLocaleString()} each
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-3 mt-auto">
          {/* Quantity Stepper Panel */}
          <div
            role="group"
            aria-label={`Quantity for ${item.title}`}
            className="flex items-center border border-border bg-card rounded-lg p-0.5 shadow-2xs"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDecrease}
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Decrease quantity"
            >
              <Minus size={12} className="stroke-[2.5]" aria-hidden="true" />
            </Button>
            <span
              className="w-8 text-center text-xs font-medium text-foreground tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleIncrease}
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Increase quantity"
            >
              <Plus size={12} className="stroke-[2.5]" aria-hidden="true" />
            </Button>
          </div>

          {/* Remove Row Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => removeFromCart(item.id)}
            className="h-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive font-medium tracking-wide transition-colors px-2 py-1.5 rounded-lg hover:bg-destructive/10 focus-visible:ring-1 focus-visible:ring-destructive"
            aria-label={`Remove ${item.title} from cart`}
          >
            <Trash2 size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
}