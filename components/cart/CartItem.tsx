"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";

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


  return (
    <div className="flex items-start gap-4 sm:gap-6 py-6 border-b border-zinc-100 last:border-0 group animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Product Image Panel */}
      <div className="relative w-20 h-24 sm:w-24 sm:h-30 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
        <Image
          src={item.image || "/images/placeholder.jpg"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Details block */}
      <div className="flex-1 flex flex-col justify-between self-stretch">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-medium text-zinc-950 font-serif hover:text-zinc-600 transition-colors">
              <Link href={`/products/${item.id}`}>{item.title}</Link>
            </h3>
            <span className="text-sm font-semibold text-zinc-950 tabular-nums pl-2">
              ${(item.price * item.quantity).toLocaleString()}
            </span>
          </div>

          {(item.material || item.color) && (
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {[item.material, item.color].filter(Boolean).join(" / ")}
            </p>
          )}
          <p className="text-xs text-zinc-400 font-light">${item.price.toLocaleString()} each</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 mt-auto">
          {/* Quantity Stepper Panel */}
          <div className="flex items-center border border-zinc-200 bg-white rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={handleDecrease}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus size={12} className="stroke-[2.5]" />
            </button>
            <span className="w-8 text-center text-xs font-medium text-zinc-800 tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus size={12} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Remove Row Button */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-600 font-medium tracking-wide group/btn transition-colors px-2 py-1.5 rounded-lg hover:bg-rose-50/50 cursor-pointer"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
