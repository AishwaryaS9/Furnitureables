"use client";

import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Cart</h1>

      {items.map((item) => (
        <div key={item.id} className="flex justify-between py-2 border-b">
          <p>{item.title}</p>
          <p>{item.quantity} × ${item.price}</p>
        </div>
      ))}
    </div>
  );
}