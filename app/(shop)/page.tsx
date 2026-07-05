"use client";

import ProductFilters from "@/components/product/filters/ProductFilters";
import ProductGrid from "@/components/product/ProductGrid";
import Image from "next/image";
import heroFurniture from "../../public/images/hero-furniture3.jpg";
import SearchBar from "@/components/product/filters/SearchBar";
import Pagination from "@/components/product/Pagination";

export default function Shop() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="relative w-full h-[60vh] md:h-[70vh]">
                <Image
                    src={heroFurniture}
                    alt="Furniture Banner"
                    fill
                    priority
                    className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Elevate Your Living Space
                    </h1>
                    <p className="text-white/80 mt-4 max-w-xl text-sm md:text-base">
                        Discover modern, stylish, and comfortable furniture crafted for
                        everyday living.
                    </p>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Section Heading */}
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                            Explore Our Collection
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Carefully curated furniture pieces designed for comfort, style,
                            and functionality.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex justify-center">
                        <SearchBar />
                        <div className="bg-white/70 backdrop-blur-md border rounded-xl p-4 shadow-sm">
                            <ProductFilters />
                        </div>
                    </div>

                    {/* Products */}
                    <div className="pt-4">
                        <ProductGrid />
                    </div>
                    <Pagination />
                </div>
            </section>
        </main>
    );
}