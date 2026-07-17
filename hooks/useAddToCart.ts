"use client";

import { useCartStore } from "@/store/cart";
import { Product } from "@/types/product";
import { getProductThumbnail } from "@/lib/utils";

export function useAddToCart() {
    const addToCart = useCartStore((s) => s.addToCart);

    return (product: Product, quantity = 1) => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: getProductThumbnail(product),
            quantity,
        });
    };
}