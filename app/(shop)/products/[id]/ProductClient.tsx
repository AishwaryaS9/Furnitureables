"use client";

import RelatedProducts from "@/components/product/RelatedProducts";
import { useCartStore } from "@/store/cart";
import Image from "next/image";

export default function ProductClient({ product }: any) {
    const addToCart = useCartStore((s) => s.addToCart);

    return (
        <main className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

                {/* Image */}
                <div className="relative w-full aspect-square bg-muted rounded-2xl overflow-hidden">
                    <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center space-y-6">

                    <h1 className="text-3xl font-bold">{product.title}</h1>

                    <p className="text-2xl text-primary">${product.price}</p>

                    <div className="text-sm text-muted-foreground space-y-1">
                        {product.material && <p>Material: {product.material}</p>}
                        {product.type && <p>Type: {product.type}</p>}
                    </div>

                    <button
                        onClick={() =>
                            addToCart({
                                id: product.id,
                                title: product.title,
                                price: product.price,
                                image: product.image,
                            })
                        }
                        className="px-6 py-3 bg-primary text-white rounded-xl"
                    >
                        Add to Cart
                    </button>

                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                <RelatedProducts type={product.type} id={product.id} />
            </div>


        </main>
    );
}