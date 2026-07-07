"use client";

import ProductGrid from "@/components/product/ProductGrid";
import Image from "next/image";
import heroFurniture from "../../public/images/hero-furniture3.jpg";
import Link from "next/link";

export default function Shop() {
    return (
        <main className="min-h-screen bg-[#FDFDFD] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">

            <section className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
                <Image
                    src={heroFurniture}
                    alt="Premium Furniture Curated Showroom Banner"
                    fill
                    priority
                    className="object-cover object-center scale-105 animate-[subtle-zoom_20s_ease-out_forwards]"
                />

                <div className="absolute inset-0 bg-linear-to-t from-zinc-900/50 via-black/20 to-zinc-900/30" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-normal text-white tracking-tight font-serif max-w-3xl leading-tight">
                        Elevate Your Living Space
                    </h1>
                    <p className="text-zinc-200/90 max-w-xl text-sm md:text-base font-light tracking-wide leading-relaxed">
                        Discover modern, meticulously engineered furniture archetypes built around organic materials and modern lifestyles.
                    </p>
                </div>
            </section>

            <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-10">
                <div className="max-w-360 mx-auto space-y-12">

                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-normal tracking-tight font-serif text-zinc-900">
                            Explore Our Collection
                        </h2>
                        <p className="text-zinc-500 text-sm font-light max-w-md mx-auto leading-relaxed">
                            Carefully curated signature pieces designed to establish clean lines, warm minimalism, and structural purpose.
                        </p>
                    </div>

                    <div className="pt-4">
                        <ProductGrid />
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold tracking-widest uppercase hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-md shadow-zinc-950/10 hover:shadow-lg hover:shadow-zinc-950/15"
                        >
                            View Full Architectural Catalog
                        </Link>
                    </div>

                </div>
            </section>
        </main>
    );
}