"use client";

import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

export default function ProductDetails() {
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading, isError } = useProduct(id);
  const addToCart = useCartStore((state) => state.addToCart);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="h-96 bg-muted rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="h-4 w-60 bg-muted rounded" />
            <div className="h-10 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <p className="text-center mt-20 text-red-500">
        Product not found
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="grid md:grid-cols-2 gap-10">

        <div className="relative w-full h-100 md:h-125 rounded-xl overflow-hidden border">
          <Image
            src={product.image || "/images/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-5">

          <h1 className="text-3xl font-bold">
            {product.title}
          </h1>

          <p className="text-muted-foreground">
            {product.material} • {product.color}
          </p>

          <p className="text-2xl font-semibold text-primary">
            ${product.price}
          </p>

          <p className="text-sm text-muted-foreground">
            Room: {product.room}
          </p>

          <p className="text-sm text-muted-foreground">
            Dimensions: {product.dimensions}
          </p>

          <p className="text-sm text-muted-foreground">
            Stock: {product.stock}
          </p>

          <Button
            className="w-full mt-4"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}