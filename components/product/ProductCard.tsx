"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, Check } from "lucide-react";
import { Product } from "@/types/product";
import { getProductThumbnail } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useCartStore } from "@/store/cart";
import WishlistButton from "../wishlist/WishlistButton";
import { formatCurrency } from "@/lib/order";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const addToCart = useAddToCart();

  const isInCart = useCartStore((s) =>
    s.items.some((item) => item.id === product.id)
  );

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart) {
      router.push("/cart");
      return;
    }

    addToCart(product);
  };

  const thumbnailUrl = getProductThumbnail(product);
  const productUrl = `/products/${product.id}`;

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      aria-labelledby={`product-title-${product.id}`}
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/50 p-3 backdrop-blur-xs hover:border-border"
    >
      {/* Hidden Structured Data for SEO */}
      <meta itemProp="name" content={product.title} />
      {thumbnailUrl && <meta itemProp="image" content={thumbnailUrl} />}
      {product.material && <meta itemProp="material" content={product.material} />}
      {product.color && <meta itemProp="color" content={product.color} />}
      <div
        itemProp="offers"
        itemScope
        itemType="https://schema.org/Offer"
        className="sr-only"
      >
        <meta itemProp="price" content={product.price.toString()} />
        <meta itemProp="priceCurrency" content="USD" />
        <link
          itemProp="availability"
          href={
            isOutOfStock
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock"
          }
        />
      </div>

      {/* Media Canvas */}
      <figure className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/40 border border-border/40 m-0">
        <Link
          href={productUrl}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full focus:outline-none"
        >
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={imageAlt || product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs tracking-widest uppercase text-muted-foreground/60">
              No Preview
            </div>
          )}
        </Link>

        {/* Status Badges */}
        {(isNewProduct || isOutOfStock) && (
          <div className="absolute top-3 left-3 z-10">
            {isOutOfStock ? (
              <span
                role="status"
                className="rounded-full bg-stock-status text-stock-status-foreground px-3 py-1 text-[9px] font-medium tracking-widest uppercase backdrop-blur-md shadow-xs"
              >
                Out of Stock
              </span>
            ) : (
              <span
                role="status"
                className="rounded-full bg-primary/90 text-primary-foreground px-3 py-1 text-[9px] font-medium tracking-widest uppercase backdrop-blur-md shadow-xs"
              >
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

        {/* Quick Add Bar — Accessible hover & focus-within */}
        {product.stock > 0 && (
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={
                isInCart
                  ? `Go to cart, ${product.title} added`
                  : `Quick add ${product.title} to cart`
              }
              className="w-full justify-between rounded-xl bg-primary/95 text-xs font-medium tracking-wide text-primary-foreground backdrop-blur-md hover:bg-primary shadow-xs disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {isInCart ? (
                <>
                  <span>Go to Cart</span>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span>Quick Add</span>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        )}
      </figure>

      {/* Details Block */}
      <div className="mt-3 flex flex-col justify-between gap-2 px-1 pb-1">
        <div>
          {product.material && (
            <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              {product.material}
            </span>
          )}

          <div className="mt-0.5 flex items-start justify-between gap-2">
            <h3
              id={`product-title-${product.id}`}
              className="text-sm font-medium text-foreground line-clamp-1"
            >
              <Link
                href={productUrl}
                className="hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
              >
                {product.title}
              </Link>
            </h3>
            <Link
              href={productUrl}
              aria-label={`View details for ${product.title}`}
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
            >
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Footer info: Price & Color */}
        <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
          <p
            className="text-sm font-semibold tracking-tight text-foreground"
            aria-label={`Price: ${formatCurrency(product.price)}`}
          >
            {formatCurrency(product.price)}
          </p>

          {product.color && (
            <div
              className="flex items-center gap-1.5"
              role="group"
              aria-label={`Available color: ${product.color}`}
            >
              <span className="text-[10px] text-muted-foreground capitalize">
                {product.color}
              </span>
              <span
                className="h-2.5 w-2.5 rounded-full border border-border bg-foreground/80"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}