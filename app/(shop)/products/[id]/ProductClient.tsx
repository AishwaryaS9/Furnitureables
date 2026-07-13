"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import { Check, Truck } from "lucide-react";
import RelatedProducts from "@/components/product/RelatedProducts";

export default function ProductClient({ product }: any) {
    const addToCart = useCartStore((s) => s.addToCart);
    const [quantity, setQuantity] = useState(1);

    const images =
        product.media?.length
            ? product.media
            : [
                {
                    url: "/images/placeholder.jpg",
                },
            ];

    const [selectedImage, setSelectedImage] = useState(
        images[0].url
    );

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image:
                product.media?.[0]?.url ??
                "/images/placeholder.jpg",
            quantity: quantity,
        });
    };

    return (
        <main className="min-h-screen bg-white text-zinc-900 antialiased">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

                {/* Main Product Section Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Left Canvas: Product Gallery */}
                    <div className="lg:col-span-7 lg:sticky lg:top-8">
                        {/* Main Image */}
                        <div className="relative aspect-[1.6] w-full rounded-3xl bg-[#f4f4f5] overflow-hidden">
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                fill
                                priority
                                className="object-contain p-6 sm:p-12 transition-transform duration-300"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                            {images.map((image: any, index: number) => (
                                <button
                                    key={image.id ?? index}
                                    type="button"
                                    onClick={() => setSelectedImage(image.url)}
                                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 
                                        ${selectedImage === image.url
                                            ? "border-zinc-900 ring-2 ring-zinc-200"
                                            : "border-zinc-200 hover:border-zinc-400"
                                        }`}
                                >
                                    <Image
                                        src={image.url}
                                        alt={`${product.title} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Canvas: Product Details Column */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Header Block (Title, Price, & Description) */}
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                                    {product.title}
                                </h1>
                                <p className="text-xl font-semibold text-zinc-800">
                                    ${product.price}
                                </p>
                            </div>

                            {/* Renders the description, or a helpful placeholder reminder if the field is missing/empty */}
                            <p className="text-zinc-600 text-sm leading-relaxed text-balance pt-1">
                                {product.description || "No description provided for this product. Please verify that the 'description' field is populated in your database and included in your data fetch query."}
                            </p>
                        </div>

                        {/* Summary Specs Block */}
                        {(product.material || product.type) && (
                            <div className="space-y-1 text-sm pt-2 border-t border-zinc-100">
                                <p className="text-zinc-500 font-medium">Material/Collection specs</p>
                                <p className="text-zinc-800 font-normal">
                                    {[product.material, product.type].filter(Boolean).join(", ")}
                                </p>
                            </div>
                        )}

                        {/* Status Pill Indicator */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            In Stock & Ready to Ship
                        </div>

                        {/* Purchasing Area Block */}
                        <div className="space-y-2 pt-2">
                            <label className="block text-xs font-medium text-zinc-500">
                                Quantity
                            </label>

                            <div className="flex items-center gap-3">
                                {/* Compact Stepper */}
                                <div className="flex items-center justify-between border border-zinc-200 rounded-lg bg-white h-11 w-28 px-1 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="font-medium text-sm tabular-nums text-zinc-900">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Bold Flat Black Capsule Button */}
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-11 bg-zinc-900 text-white hover:bg-zinc-800 font-medium rounded-lg text-sm transition-colors shadow-sm"
                                >
                                    Add to Bag
                                </button>
                            </div>
                        </div>

                        {/* Minimalist Trust Checklists */}
                        <div className="space-y-2 pt-4 border-t border-zinc-100 text-xs text-zinc-600">
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-zinc-400" />
                                <span>Free delivery guaranteed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-zinc-400" />
                                <span>Free delivery warranty</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Section Layout */}
                <div className="mt-28 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-10">
                        You Might Also Like
                    </h2>
                    <div className="text-left">
                        <RelatedProducts type={product.type} id={product.id} />
                    </div>
                </div>

            </div>
        </main>
    );
}