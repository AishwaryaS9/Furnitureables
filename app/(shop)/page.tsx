"use client";

import ProductGrid from "@/components/product/ProductGrid";
import Image from "next/image";
import heroFurniture from "../../public/images/hero-sofa.webp";
import Link from "next/link";

export default function Shop() {
    return (
        <main className="min-h-screen bg-[#FAF8F5] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
            <section className="relative min-h-162.5 h-[85vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
                <Image
                    src={heroFurniture}
                    alt="Premium Furniture Collection"
                    fill
                    priority
                    className="object-cover object-[70%_center] md:object-center scale-105 animate-[subtle-zoom_20s_ease-out_forwards]"
                />

                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-360 mx-auto w-full px-5 sm:px-8 lg:px-10">

                        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 sm:px-4">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs uppercase tracking-[0.3em] text-white/90">
                                    New Autumn Collection
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white">
                                Elevate
                                <br />
                                Your Living
                                <br />
                                Space
                            </h1>

                            {/* Description */}
                            <p className="mt-5 max-w-128.5 text-white/80 text-base sm:text-lg leading-7 sm:leading-8">
                                Timeless furniture crafted with premium materials,
                                modern aesthetics, and exceptional comfort for
                                contemporary homes.
                            </p>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

                                <Link
                                    href="/products"
                                    className="flex justify-center rounded-xl bg-white px-8 py-4 text-sm font-semibold text-black transition-all hover:scale-[1.03] hover:bg-zinc-100"
                                >
                                    Shop Collection
                                </Link>

                                <Link
                                    href="/about"
                                    className="flex justify-center rounded-xl border border-white/40 bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black"
                                >
                                    Our Story
                                </Link>

                            </div>

                            {/* Trust */}
                            <div className="mt-10 grid grid-cols-3 gap-6 sm:gap-10 max-w-xl text-white/80">

                                <div>
                                    <p className="text-2xl sm:text-3xl font-semibold">15K+</p>
                                    <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-widest leading-relaxed">
                                        Happy Customers
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl sm:text-3xl font-semibold">250+</p>
                                    <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-widest leading-relaxed">
                                        Premium Designs
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl sm:text-3xl font-semibold">4.9★</p>
                                    <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-widest leading-relaxed">
                                        Customer Rating
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Card */}
                <div className="absolute right-4 lg:right-10 bottom-6 lg:bottom-12 hidden md:block">

                    <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 w-60 lg:w-72 shadow-2xl">

                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                            Featured
                        </p>

                        <h3 className="mt-3 text-2xl font-serif text-white">
                            Scandinavian
                            Lounge Chair
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-white/70">
                            Handcrafted oak wood with premium linen upholstery.
                        </p>

                        <Link
                            href="/products"
                            className="mt-6 inline-flex text-sm font-semibold text-white underline underline-offset-4"
                        >
                            Discover →
                        </Link>

                    </div>
                </div>
                {/* <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-b from-transparent to-[#FAF8F5]" /> */}
            </section>

            <section className="py-14 md:py-20 px-5 sm:px-6 lg:px-10">
                <div className="max-w-360 mx-auto space-y-12">

                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-serif text-zinc-900">
                            Explore Our Collection
                        </h2>
                        <p className="text-zinc-500 text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
                            Carefully curated signature pieces designed to establish clean lines, warm minimalism, and structural purpose.
                        </p>
                    </div>

                    <div className="pt-4">
                        <ProductGrid />
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold tracking-widest uppercase hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-md shadow-zinc-950/10 hover:shadow-lg hover:shadow-zinc-950/15"
                        >
                            View Full Catalog
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}



