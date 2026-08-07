import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { ProductMedia } from "@/types/product";

export function getProductThumbnail(product: {
  media?: ProductMedia[];
}) {
  return (
    product.media?.find((m) => m.type === "IMAGE")?.url ??
    "/images/placeholder.jpg"
  );
}

export function formatPrice(amount: number, currency: "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
