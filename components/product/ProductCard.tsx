"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, ArrowRight } from "lucide-react";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  material?: string;
  color?: string;
  type?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="group relative flex flex-col bg-card border border-border/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-border">

      <Link href={`/products/${product.id}`} className="relative w-full aspect-4/5 overflow-hidden bg-muted/30 block">
        <Image
          src={product.image || "/images/placeholder.jpg"}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={false}
        />

        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <Button
            className="w-full bg-primary/95 text-primary-foreground backdrop-blur-xs shadow-md rounded-xl py-5 text-xs font-semibold uppercase tracking-wider hover:bg-primary gap-2"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            <ShoppingBag size={14} />
            Quick Add
          </Button>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between text-center space-y-3">
        <div className="space-y-1">
          {/* Attributes */}
          {(product.material || product.color) && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 block">
              {[product.material, product.color].filter(Boolean).join(" • ")}
            </span>
          )}

          {/* Title */}
          <h3 className="text-base font-serif font-bold text-primary line-clamp-1 group-hover:text-muted-foreground transition-colors">
            <Link href={`/products/${product.id}`}>
              {product.title}
            </Link>
          </h3>
        </div>

        {/* Price & Primary Link Row */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-left">
          <span className="text-base font-bold text-foreground">
            ${product.price.toLocaleString()}
          </span>

          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors group/link"
          >
            <span>Details</span>
            <ArrowRight size={12} className="transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>

    </div>
  );
}