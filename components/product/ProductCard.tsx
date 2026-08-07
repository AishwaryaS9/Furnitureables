"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice, getProductThumbnail } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useAddToCart";
import WishlistButton from "../wishlist/WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart();

  const isNewProduct = (() => {
    const rawDate = product.createdAt;
    if (!rawDate) return false;

    const createdDate = new Date(rawDate).getTime();
    if (isNaN(createdDate)) return false;

    const currentDate = new Date().getTime();
    const daysDifference = (currentDate - createdDate) / (1000 * 60 * 60 * 24);

    return daysDifference >= 0 && daysDifference <= 7;
  })();

  const isOutOfStock = product.stock <= 0;

  const imageAlt = [product.title, product.material, product.color]
    .filter(Boolean)
    .join(", ");

  // const formattedPrice = new Intl.NumberFormat("en-US", {
  //   style: "currency",
  //   currency: "USD",
  //   maximumFractionDigits: 0,
  // }).format(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const thumbnailUrl = getProductThumbnail(product);

  return (
    <div className="group relative flex flex-col rounded-2xl border border-stone-200/60 bg-stone-50/50 p-3 transition-shadow duration-300 hover:shadow-md hover:shadow-stone-900/5">
      {/* Editorial Image Canvas */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100">
        <Link href={`/products/${product.id}`} tabIndex={-1} className="block h-full w-full">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={imageAlt || product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs tracking-widest uppercase text-stone-400">
              No Preview
            </div>
          )}
        </Link>

        {/* Status Badge */}
        {(isNewProduct || isOutOfStock) && (
          <div className="absolute top-3 left-3 z-10">
            {isOutOfStock ? (
              <span className="rounded-full bg-stock-status text-stock-status-foreground px-3 py-1 text-[9px] font-medium tracking-widest uppercase backdrop-blur-md">
                Out of Stock
              </span>
            ) : (
              <span className="rounded-full bg-success text-taupe-400 px-3 py-1 text-[9px] font-medium tracking-widest uppercase">
                New Arrival
              </span>
            )}
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton
            productId={product.id}
            isWishlisted={product.isWishlisted}
          />
        </div>

        {/* Quick Add Bar — fades in on hover, no motion/slide */}
        {product.stock > 0 && (
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full justify-between rounded-lg bg-stone-900/90 text-xs font-medium tracking-wide text-stone-100 backdrop-blur-md hover:bg-stone-900 disabled:opacity-50"
            >
              <span>Quick Add</span>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Editorial Details Block */}
      <div className="mt-3 flex flex-col justify-between gap-2 px-1 pb-1">
        <div>
          {product.material && (
            <span className="text-[11px] font-medium tracking-wider text-stone-400 uppercase">
              {product.material}
            </span>
          )}

          <div className="mt-0.5 flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-foreground line-clamp-1">
              <Link href={`/products/${product.id}`} className="hover:underline underline-offset-4">
                {product.title}
              </Link>
            </h3>
            <Link
              href={`/products/${product.id}`}
              aria-label={`View ${product.title}`}
              className="text-stone-400 hover:text-foreground"
            >
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-stone-200/50 pt-1">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {/* {formattedPrice} */}
            {formatPrice(product.price, "USD")}
          </p>

          {product.color && (
            <div className="flex items-center gap-1.5" title={`Color: ${product.color}`}>
              <span className="text-[10px] text-stone-400 capitalize">
                {product.color}
              </span>
              <span className="h-2.5 w-2.5 rounded-full border border-stone-300 bg-stone-800" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}