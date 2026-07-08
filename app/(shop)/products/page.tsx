"use client";

import ProductCard from "@/components/product/ProductCard";
import { ShoppingBag, SlidersHorizontal } from "lucide-react";
import Pagination from "@/components/product/Pagination";
import SearchBar from "@/components/product/filters/SearchBar";
import ProductFilters from "@/components/product/filters/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { useFilterStore } from "@/store/useFilterStore";

export default function ProductsPage() {
    const { data: products, isLoading } = useProducts();
    const { setFilter } = useFilterStore();

    const filters = useFilterStore((s) => s.filters);


    const items = products?.items || [];
    const total = products?.total || 0;
    const totalPages = Math.ceil(total / 8);

    return (
        <main className="min-h-screen bg-[#FDFDFD] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20">
                <nav className="mb-6 text-[11px] tracking-widest text-zinc-400 uppercase font-medium">
                    <a href="/" className="hover:text-zinc-900 transition-colors">Home</a>
                    <span className="mx-2 text-zinc-300">/</span>
                    <span className="text-zinc-900 font-semibold">Shop All</span>
                </nav>

                <header className="max-w-3xl mb-16 space-y-4">
                    <div className="inline-flex items-center gap-3 bg-zinc-100/80 border border-zinc-200/40 rounded-full px-3 py-1 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-zinc-600 tracking-tight">
                            {total} Exclusive Pieces Available
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-zinc-900 font-serif leading-none">
                        All Collections
                    </h1>
                    <p className="text-base sm:text-lg text-zinc-500 font-light leading-relaxed max-w-2xl">
                        Sustainably engineered solid wood furniture, designed to blur the line between structural art and architectural modern living.
                    </p>
                </header>

                <section className="sticky top-0 z-30 bg-[#FDFDFD]/80 backdrop-blur-md border-b border-zinc-200/60 py-4 mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between transition-all">
                    <div className="w-full sm:max-w-md relative group">
                        <SearchBar />
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <span className="text-xs text-zinc-400 font-medium whitespace-nowrap hidden sm:inline">Sort by:</span>
                            <select
                                className="text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 cursor-pointer transition-all"
                                value={filters.sortBy ?? ""}
                                onChange={(e) =>
                                    setFilter(
                                        "sortBy",
                                        e.target.value || undefined
                                    )
                                }>

                                <option value="">Sort By</option>

                                <option value="latest">
                                    Newest Additions
                                </option>

                                <option value="priceAsc">
                                    Price: Low → High
                                </option>

                                <option value="priceDesc">
                                    Price: High → Low
                                </option>

                                <option value="nameAsc">
                                    Name: A → Z
                                </option>

                                <option value="nameDesc">
                                    Name: Z → A
                                </option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="lg:grid lg:grid-cols-4 lg:gap-10 items-start">
                    <aside className="hidden lg:block lg:col-span-1 sticky top-28 space-y-8 bg-zinc-50/40 p-6 rounded-2xl border border-zinc-100">
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="w-3 h-3 text-zinc-900" /> Filter Catalog
                            </h3>
                            <ProductFilters />
                        </div>
                    </aside>

                    {/* Right Product Space */}
                    <div className="lg:col-span-3">

                        {/* Loading Grid Skeletons */}
                        {isLoading && (
                            <div className="grid gap-x-6 gap-y-12 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="space-y-4 animate-pulse group">
                                        <div className="aspect-3/4 w-full rounded-2xl bg-zinc-100 border border-zinc-200/40" />
                                        <div className="space-y-2.5 px-1">
                                            <div className="h-4 bg-zinc-100 rounded-md w-2/3" />
                                            <div className="h-3.5 bg-zinc-100 rounded-md w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && items.length === 0 && (
                            <div className="text-center py-28 border border-dashed border-zinc-200 rounded-3xl p-12 bg-white/50 backdrop-blur-xs max-w-lg mx-auto">
                                <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 mx-auto border border-zinc-100 shadow-xs mb-4">
                                    <ShoppingBag className="w-6 h-6 stroke-[1.25]" />
                                </div>
                                <h3 className="text-lg font-medium text-zinc-900 tracking-tight">No match found</h3>
                                <p className="text-sm text-zinc-500 font-light mt-2 max-w-xs mx-auto leading-relaxed">
                                    We couldn't find items matching your dynamic filter criteria. Try adjusting your selections or look at a fresh category.
                                </p>
                            </div>
                        )}

                        {/* Main Showcase Feed */}
                        {!isLoading && items.length > 0 && (
                            <div className="space-y-16">
                                <div className="grid gap-x-6 gap-y-14 transition-all duration-500 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                                    {items.map((product: any) => (
                                        <div
                                            key={product.id}
                                            className="group relative transition-all duration-700 ease-[cubic-bezier(0.215,0.61,0.355,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)] rounded-2xl"
                                        >
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>

                                <footer className="pt-12 border-t border-zinc-100 flex items-center justify-center">
                                    <Pagination totalPages={totalPages} />
                                </footer>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </main>
    );
}
