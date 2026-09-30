import Image from "next/image";
import Link from "next/link";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import ProductGrid from "@/components/product/ProductGrid";
import ShopByCategory from "@/components/product/ShopByCategory";
import DesignedForYou from "@/components/layout/DesignedForYou";
import HeroActions from "@/components/home/HeroActions";
import heroFurniture from "@/public/images/hero-sofa.webp";
import { getFeaturedProducts, getTopCategories } from "@/lib/data/cached";

// Statically generated and refreshed in the background, so the storefront
// never waits on a serverless function + database round trip.
export const revalidate = 300;

export default async function Shop() {
    // Seed the React Query cache with server-rendered data. The client hooks
    // (same query keys) find it already there: no skeletons, no waterfall
    // (JS -> hydrate -> fetch /api/graphql -> render), and the product / category
    // images are in the initial HTML.
    const queryClient = new QueryClient();

    try {
        const [products, categories] = await Promise.all([
            getFeaturedProducts(),
            getTopCategories(),
        ]);

        queryClient.setQueryData(["products", {}, 1], products);
        queryClient.setQueryData(["productCategories", 5], categories);
    } catch (error) {
        // If the database is unreachable, fall back to client-side fetching.
        console.error("[home] Failed to prefetch storefront data:", error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {/* Hero Section */}
            <section
                aria-labelledby="hero-heading"
                className="relative min-h-162.5 h-[85vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden"
            >
                {/* Background Image: the LCP element, painted immediately (no opacity animation) */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 overflow-hidden rounded-b-[2.5rem]"
                >
                    <Image
                        src={heroFurniture}
                        alt=""
                        fill
                        priority
                        fetchPriority="high"
                        sizes="100vw"
                        placeholder="empty"
                        className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/40 to-foreground/20" />
                </div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-360 mx-auto w-full px-5 sm:px-8 lg:px-10">
                        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-md px-3 py-2 sm:px-4">
                                <span
                                    aria-hidden="true"
                                    className="h-2 w-2 rounded-full bg-success"
                                />
                                <span className="text-xs uppercase tracking-[0.3em] text-primary-foreground">
                                    New Collection
                                </span>
                            </div>

                            {/* Heading */}
                            <h1
                                id="hero-heading"
                                className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight text-primary-foreground leading-[1.03]"
                            >
                                Elevate Your <br />
                                <span className="italic font-light text-primary-foreground/90">Living</span> Space.
                            </h1>

                            {/* Description */}
                            <p className="mt-5 max-w-128.5 text-primary-foreground/90 text-base sm:text-md leading-7 sm:leading-8">
                                Timeless furniture crafted with premium materials,
                                modern aesthetics, and exceptional comfort for
                                contemporary homes.
                            </p>

                            <HeroActions />
                        </div>
                    </div>
                </div>

                {/* Floating Card */}
                <aside
                    aria-label="Design philosophy spotlight"
                    className="absolute right-4 lg:right-10 bottom-6 lg:bottom-12 hidden md:block"
                >
                    <div className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/10 backdrop-blur-xl p-6 w-60 lg:w-72 shadow-2xl">
                        <p
                            aria-hidden="true"
                            className="text-xs uppercase tracking-[0.3em] text-primary-foreground/80"
                        >
                            The Art of Home
                        </p>

                        <h2 className="mt-3 text-2xl font-serif text-primary-foreground">
                            Form Meets Comfort
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-primary-foreground/85">
                            Refined silhouettes and natural materials created for spaces that feel effortlessly yours.
                        </p>

                        <div aria-hidden="true" className="mt-6 flex items-center gap-3">
                            <span className="h-px w-8 bg-primary-foreground/40" />
                            <span className="text-xs uppercase tracking-[0.2em] text-primary-foreground/80">
                                Thoughtfully Designed
                            </span>
                        </div>
                    </div>
                </aside>
            </section>

            {/* Product Categories Section */}
            <ShopByCategory />

            {/* Featured Collection Section */}
            <section
                aria-labelledby="collection-heading"
                className="py-14 md:py-20 px-5 sm:px-6 lg:px-10"
            >
                <div className="max-w-360 mx-auto space-y-12">
                    <header className="text-center space-y-3 max-w-2xl mx-auto">
                        <h2
                            id="collection-heading"
                            className="text-3xl sm:text-4xl font-normal tracking-tight font-serif text-foreground"
                        >
                            Explore Our Collection
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
                            Carefully curated signature pieces designed to establish clean lines, warm minimalism, and structural purpose.
                        </p>
                    </header>

                    <div
                        className="pt-4"
                        role="region"
                        aria-label="Featured Products Grid"
                    >
                        <ProductGrid ignoreGlobalFilters />
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            View Full Catalog
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recommendations Section */}
            <DesignedForYou />
        </HydrationBoundary>
    );
}
