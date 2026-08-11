"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { ShoppingBag, SlidersHorizontal, ArrowUpDown, Filter } from "lucide-react";
import Pagination from "@/components/product/Pagination";
import ProductFilters from "@/components/product/filters/ProductFilters";

import { useProducts } from "@/hooks/useProducts";
import { useFilterStore } from "@/store/useFilterStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CategoryPills from "@/components/product/filters/CategoryPills";

export default function ProductsPage() {
    const { data: products, isLoading } = useProducts();
    const { setFilter } = useFilterStore();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const filters = useFilterStore((s) => s.filters);

    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryParam = searchParams.get("category") ?? undefined;

    useEffect(() => {
        setFilter("category", categoryParam);
    }, [categoryParam, setFilter]);

    const items = products?.items ?? [];
    const total = products?.total ?? 0;
    const totalPages = Math.ceil(total / 8);

    const activeFiltersCount = Object.values(filters).filter(
        (v) => v !== undefined && v !== "" && v !== "all"
    ).length;

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "All Collections - Furniture Catalog",
        "description": "Sustainably engineered solid wood furniture designed for modern living.",
        "numberOfItems": items.length,
        "itemListElement": items.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": product.title,
                "url": `/products/${product.id}`,
                "offers": {
                    "@type": "Offer",
                    "price": product.price,
                    "priceCurrency": "USD",
                    "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                },
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />

            <main
                id="main-content"
                tabIndex={-1}
                className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background transition-colors duration-200"
            >
                <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                    {/* Breadcrumb Navigation */}
                    <nav aria-label="Breadcrumb" className="mb-6">
                        <ol className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li aria-hidden="true" className="text-border">/</li>
                            <li>
                                <span className="text-foreground font-semibold" aria-current="page">
                                    Shop All
                                </span>
                            </li>
                        </ol>
                    </nav>

                    {/* Header Section */}
                    <header className="max-w-3xl mb-10 sm:mb-14 space-y-3">
                        <div
                            className="inline-flex items-center gap-2.5 bg-secondary/80 border border-border/60 rounded-full px-3.5 py-1.5 backdrop-blur-md shadow-xs"
                            role="status"
                            aria-live="polite"
                        >
                            <span className="relative flex h-2 w-2" aria-hidden="true">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                            </span>
                            <span className="text-xs font-medium text-foreground/80 tracking-tight">
                                {isLoading ? "Fetching catalog..." : `${total} Exclusive Pieces Available`}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-foreground leading-[1.1]">
                            All Collections
                        </h1>

                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
                            Sustainably engineered solid wood furniture, designed to blur the line between structural art and architectural modern living.
                        </p>

                        <CategoryPills
                            activeCategory={filters.category}
                            onSelect={(type) => {
                                const params = new URLSearchParams(searchParams.toString());
                                if (type) {
                                    params.set("category", type);
                                } else {
                                    params.delete("category");
                                }
                                const query = params.toString();
                                router.push(query ? `/products?${query}` : "/products");
                            }}
                        />
                    </header>

                    {/* Top Toolbar (Filter button on mobile & Sort options) */}
                    <div className="flex items-center justify-between gap-3 mb-8 sm:mb-12 pb-4 border-b border-border/80">
                        {/* Mobile Filter Trigger Button */}
                        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                            <SheetTrigger
                                type="button"
                                className="lg:hidden flex items-center gap-2 text-xs font-medium border border-input bg-card rounded-lg h-9 px-3.5 shadow-xs cursor-pointer"
                                aria-label="Open filter menu"
                            >
                                <Filter className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                                <span>Filters</span>
                                {activeFiltersCount > 0 && (
                                    <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-semibold">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </SheetTrigger>

                            <SheetContent side="left" className="w-full max-w-xs p-6 overflow-y-auto">
                                <SheetHeader className="text-left pb-4 border-b border-border mb-4">
                                    <SheetTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                                        <SlidersHorizontal className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                                        <span>Filter Catalog</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <ProductFilters />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="lg:grid lg:grid-cols-4 lg:gap-10 items-start">
                        {/* Desktop Sidebar Filters */}
                        <aside
                            aria-label="Product Filters"
                            className="hidden lg:block lg:col-span-1 sticky top-24 space-y-6 bg-card/60 backdrop-blur-xs p-6 rounded-2xl border border-border/80 shadow-xs"
                        >
                            <div>
                                <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-4 flex items-center gap-2">
                                    <SlidersHorizontal className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                                    <span>Filter Catalog</span>
                                </h2>
                                <ProductFilters />
                            </div>
                        </aside>

                        {/* Product Feed Area */}
                        <div className="lg:col-span-3 min-w-0" id="product-grid" aria-live="polite">
                            {/* Skeleton Loading State */}
                            {isLoading && (
                                <div
                                    role="status"
                                    aria-label="Loading products"
                                    className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                                >
                                    <span className="sr-only">Loading catalog products...</span>
                                    {[...Array(6)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="space-y-4 animate-pulse rounded-2xl border border-border/50 p-3 bg-card"
                                        >
                                            <div className="aspect-square w-full rounded-lg bg-muted" />
                                            <div className="space-y-2.5 px-1">
                                                <div className="h-4 bg-muted rounded-md w-2/3" />
                                                <div className="h-3.5 bg-muted rounded-md w-1/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty Results State */}
                            {!isLoading && items.length === 0 && (
                                <div
                                    role="region"
                                    aria-label="No products found"
                                    className="text-center py-20 sm:py-28 border border-dashed border-border rounded-3xl p-8 sm:p-12 bg-card/50 backdrop-blur-xs max-w-lg mx-auto"
                                >
                                    <div
                                        className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mx-auto border border-border shadow-xs mb-4"
                                        aria-hidden="true"
                                    >
                                        <ShoppingBag className="w-6 h-6 stroke-[1.25]" />
                                    </div>
                                    <h2 className="text-lg font-medium text-foreground tracking-tight">No match found</h2>
                                    <p className="text-sm text-muted-foreground font-light mt-2 max-w-xs mx-auto leading-relaxed">
                                        We couldn&apos;t find items matching your dynamic filter criteria. Try adjusting your selections or clearing your filters.
                                    </p>
                                </div>
                            )}

                            {/* Product Showcase Feed */}
                            {!isLoading && items.length > 0 && (
                                <section aria-label="Products list" className="space-y-12 sm:space-y-16">
                                    <div className="grid gap-x-6 gap-y-10 sm:gap-y-12 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                                        {items.map((product) => (
                                            <div
                                                key={product.id}
                                                className="group relative transition-transform duration-300 hover:-translate-y-1 focus-within:-translate-y-1 rounded-2xl"
                                            >
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination Section */}
                                    <nav
                                        aria-label="Catalog pagination"
                                        className="pt-10 border-t border-border flex items-center justify-center"
                                    >
                                        <Pagination totalPages={totalPages} />
                                    </nav>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}