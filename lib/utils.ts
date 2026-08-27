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
    "/images/placeholder.webp"
  );
}

export function formatPrice(amount: number, currency: "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCategoryLabel(type: string) {
  return type
    .replace(/[-_]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) =>
      word.length > 3 && word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
