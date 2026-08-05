"use client";

import ProductGrid from "@/components/product/ProductGrid";
import Image from "next/image";
import heroFurniture from "../../public/images/hero-sofa.png";
import Link from "next/link";

export default function Shop() {
    return (
        <main className="min-h-screen bg-[#FAF8F5] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
            {/* <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-10"></section> */}
            <section className="relative h-[80vh] md:h-[90vh] overflow-hidden">
                <Image
                    src={heroFurniture}
                    alt="Premium Furniture Collection"
                    fill
                    priority
                    className="object-cover object-center scale-105 animate-[subtle-zoom_20s_ease-out_forwards]"
                />

                {/* Multi-layered Gradient Overlay for Depth and Readability */}
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />


                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-360 mx-auto w-full px-6 lg:px-10">

                        <div className="max-w-3xl">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 mb-6">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs uppercase tracking-[0.3em] text-white/90">
                                    New Autumn Collection
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="font-serif text-5xl md:text-7xl leading-tight text-white">
                                Elevate
                                <br />
                                Your Living
                                <br />
                                Space
                            </h1>

                            {/* Description */}
                            <p className="mt-6 max-w-xl text-white/80 text-lg leading-8">
                                Timeless furniture crafted with premium materials,
                                modern aesthetics, and exceptional comfort for
                                contemporary homes.
                            </p>

                            {/* Buttons */}
                            <div className="mt-10 flex flex-wrap gap-4">

                                <Link
                                    href="/products"
                                    className="rounded-xl bg-white px-8 py-4 text-sm font-semibold text-black transition-all hover:scale-[1.03] hover:bg-zinc-100"
                                >
                                    Shop Collection
                                </Link>

                                <Link
                                    href="/about"
                                    className="rounded-xl border border-white/40 bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black"
                                >
                                    Our Story
                                </Link>

                            </div>

                            {/* Trust */}
                            <div className="mt-12 flex flex-wrap gap-10 text-white/80">

                                <div>
                                    <p className="text-3xl font-semibold">15K+</p>
                                    <p className="text-sm uppercase tracking-widest">
                                        Happy Customers
                                    </p>
                                </div>

                                <div>
                                    <p className="text-3xl font-semibold">250+</p>
                                    <p className="text-sm uppercase tracking-widest">
                                        Premium Designs
                                    </p>
                                </div>

                                <div>
                                    <p className="text-3xl font-semibold">4.9★</p>
                                    <p className="text-sm uppercase tracking-widest">
                                        Customer Rating
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>

                {/* Floating Card */}
                <div className="absolute right-10 bottom-12 hidden lg:block">

                    <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 w-72 shadow-2xl">

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

//chatgpt code end=================================


