"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useProductCategories } from "@/hooks/useProductCategories";
import { formatCategoryLabel } from "@/lib/utils";

const TILE_LAYOUT = [
    "col-span-2 row-span-2 sm:col-span-1 sm:row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
];

export default function ShopByCategory() {
    const { data: categories = [], isLoading } = useProductCategories(5);

    if (!isLoading && categories.length === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="categories-heading"
            className="pt-14 md:pt-20 px-4 sm:px-6 lg:px-10"
        >
            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
                <header className="text-center space-y-3 max-w-2xl mx-auto">
                    <h2
                        id="categories-heading"
                        className="text-3xl sm:text-4xl font-normal tracking-tight font-serif text-foreground"
                    >
                        Shop By Categories
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
                        Step into rooms curated by purpose. Pick a space and discover
                        the pieces made to complete it.
                    </p>
                </header>

                {/* Loading Skeleton Region */}
                {isLoading && (
                    <div
                        role="status"
                        aria-label="Loading product categories"
                        aria-busy="true"
                        className="grid grid-cols-2 sm:grid-cols-3 auto-rows-40 sm:auto-rows-38 md:auto-rows-46 lg:auto-rows-54 gap-4 sm:gap-5"
                    >
                        <span className="sr-only">Loading furniture categories...</span>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`${TILE_LAYOUT[i]} rounded-3xl bg-muted animate-pulse`}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                )}

                {/* Categories Grid */}
                {!isLoading && (
                    <ul
                        role="list"
                        aria-label="Product categories catalog"
                        className="grid grid-cols-2 sm:grid-cols-3 auto-rows-40 sm:auto-rows-38 md:auto-rows-46 lg:auto-rows-54 gap-4 sm:gap-5 list-none p-0 m-0"
                    >
                        {categories.map((cat, i) => {
                            const formattedLabel = formatCategoryLabel(cat.type);
                            const categoryUrl = `/products?category=${encodeURIComponent(cat.type)}`;

                            return (
                                <li
                                    key={cat.type}
                                    className={`${TILE_LAYOUT[i] ?? "col-span-1 row-span-1"} flex`}
                                >
                                    <Link
                                        href={categoryUrl}
                                        aria-label={`Browse ${formattedLabel} furniture collection (${cat.count} ${cat.count === 1 ? "item" : "items"} available)`}
                                        className="group relative w-full h-full overflow-hidden rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    >
                                        <Image
                                            src={cat.image || "/images/placeholder.jpg"}
                                            alt={`${formattedLabel} interior furniture collection showcase`}
                                            fill
                                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 50vw"
                                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                        />
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-0 bg-linear-to-t from-foreground/85 via-foreground/20 to-transparent"
                                        />

                                        <span
                                            aria-hidden="true"
                                            className="absolute top-4 right-4 sm:top-5 sm:right-5 flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/90 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary-foreground"
                                        >
                                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                        </span>

                                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5">
                                            <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-primary-foreground leading-tight">
                                                {formattedLabel}
                                            </h3>
                                            <p className="mt-1 text-xs sm:text-sm text-primary-foreground/80">
                                                {cat.count} {cat.count === 1 ? "item" : "items"} available
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </section>
    );
}