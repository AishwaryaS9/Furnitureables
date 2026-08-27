"use client";

import ProductGrid from "@/components/product/ProductGrid";
import ShopByCategory from "@/components/product/ShopByCategory";
import DesignedForYou from "@/components/layout/DesignedForYou";
import Image from "next/image";
import Link from "next/link";
import heroFurniture from "@/public/images/hero-sofa.webp";

export default function Shop() {
    return (
        <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
            <section className="relative min-h-162.5 h-[85vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">

                <div className="absolute inset-0 z-0 overflow-hidden rounded-b-[2.5rem]">
                    <Image
                        src={heroFurniture}
                        alt="Minimalist Furniture Collection"
                        fill
                        priority
                        className="object-cover object-center scale-105 animate-[subtle-zoom_25s_ease-out_forwards]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/40 to-foreground/20" />
                </div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-360 mx-auto w-full px-5 sm:px-8 lg:px-10">

                        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-md px-3 py-2 sm:px-4">
                                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                                <span className="text-xs uppercase tracking-[0.3em] text-primary-foreground/90">
                                    New Autumn Collection
                                </span>
                            </div>


                            {/* Heading */}

                            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight text-primary-foreground leading-[1.03]">
                                Elevate Your <br />
                                <span className="italic font-light text-primary-foreground/80">Living</span> Space.
                            </h1>

                            {/* Description */}
                            <p className="mt-5 max-w-128.5 text-primary-foreground/80 text-base sm:text-md leading-7 sm:leading-8">
                                Timeless furniture crafted with premium materials,
                                modern aesthetics, and exceptional comfort for
                                contemporary homes.
                            </p>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Link
                                    href="/products"
                                    className="flex justify-center rounded-xl bg-primary-foreground px-8 py-4 text-sm font-semibold text-primary transition-all hover:scale-[1.03] hover:bg-primary-foreground/90"
                                >
                                    Explore Collection
                                </Link>
                                <Link
                                    href="/about"
                                    className="flex justify-center rounded-xl border border-primary-foreground/40 bg-primary-foreground/10 backdrop-blur-md px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground hover:text-primary"
                                >
                                    Our Design Ethos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Card */}
                <div className="absolute right-4 lg:right-10 bottom-6 lg:bottom-12 hidden md:block">
                    <div className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/10 backdrop-blur-xl p-6 w-60 lg:w-72 shadow-2xl">
                        <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/60">
                            The Art of Home
                        </p>

                        <h3 className="mt-3 text-2xl font-serif text-primary-foreground">
                            Form Meets Comfort
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-primary-foreground/70">
                            Refined silhouettes and natural materials created for spaces that feel effortlessly yours.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            <span className="h-px w-8 bg-primary-foreground/40" />
                            <span className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60">
                                Thoughtfully Designed
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <ShopByCategory />

            <section className="py-14 md:py-20 px-5 sm:px-6 lg:px-10">
                <div className="max-w-360 mx-auto space-y-12">
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-serif text-foreground">
                            Explore Our Collection
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
                            Carefully curated signature pieces designed to establish clean lines, warm minimalism, and structural purpose.
                        </p>
                    </div>

                    <div className="pt-4">
                        <ProductGrid ignoreGlobalFilters />
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/15"
                        >
                            View Full Catalog
                        </Link>
                    </div>
                </div>
            </section>

            <DesignedForYou />
        </main>
    );
}