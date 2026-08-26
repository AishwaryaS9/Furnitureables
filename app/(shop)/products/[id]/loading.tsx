import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
    return (
        <main
            className="min-h-screen bg-background text-foreground antialiased"
            role="status"
            aria-busy="true"
            aria-label="Loading product"
        >
            <span className="sr-only">Loading product details…</span>

            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
                {/* Breadcrumb Skeleton */}
                <div className="mb-6 flex items-center gap-2" aria-hidden="true">
                    <Skeleton className="h-3.5 w-10" />
                    <span className="text-border">/</span>
                    <Skeleton className="h-3.5 w-14" />
                    <span className="text-border">/</span>
                    <Skeleton className="h-3.5 w-32" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" aria-hidden="true">
                    {/* Left Canvas: Gallery Skeleton */}
                    <div className="lg:col-span-6 space-y-3">
                        <Skeleton className="aspect-square sm:aspect-4/3 w-full max-h-115 rounded-2xl" />

                        <div className="flex items-center px-1">
                            <Skeleton className="h-3 w-14" />
                        </div>

                        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-16 shrink-0 rounded-xl" />
                            ))}
                        </div>
                    </div>

                    {/* Right Canvas: Product Details Skeleton */}
                    <div className="lg:col-span-6 space-y-5">
                        {/* Header Title & Pricing */}
                        <div className="space-y-3 pb-5 border-b border-border/80">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-9 sm:h-10 w-3/4" />
                            <Skeleton className="h-7 w-28" />
                            <Skeleton className="h-3.5 w-full" />
                            <Skeleton className="h-3.5 w-5/6" />
                            <Skeleton className="h-3.5 w-2/3" />
                        </div>

                        {/* Specifications Block */}
                        <div className="space-y-1.5">
                            <Skeleton className="h-2.5 w-24" />
                            <div className="grid grid-cols-2 gap-3 bg-secondary/40 border border-border/60 p-3 rounded-xl">
                                <div className="space-y-1.5">
                                    <Skeleton className="h-2.5 w-14" />
                                    <Skeleton className="h-3.5 w-20" />
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton className="h-2.5 w-10" />
                                    <Skeleton className="h-3.5 w-16" />
                                </div>
                            </div>
                        </div>

                        {/* Purchasing Controls */}
                        <div className="space-y-2.5 pt-1">
                            <Skeleton className="h-2.5 w-16" />
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-11 w-28 rounded-xl" />
                                <Skeleton className="h-11 flex-1 rounded-xl" />
                                <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="space-y-3 pt-4 border-t border-border/80">
                            <div className="flex items-center gap-2.5">
                                <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-3 w-48" />
                                    <Skeleton className="h-2.5 w-56" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-3 w-52" />
                                    <Skeleton className="h-2.5 w-44" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Skeleton */}
                <section className="mt-16 sm:mt-24 pt-10 border-t border-border" aria-hidden="true">
                    <div className="mb-6 space-y-2">
                        <Skeleton className="h-7 w-56" />
                        <Skeleton className="h-3.5 w-72" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-4/5 w-full rounded-2xl border border-border/20" />
                                <div className="space-y-3 px-1">
                                    <Skeleton className="h-4 w-3/4 rounded-md" />
                                    <Skeleton className="h-3.5 w-1/4 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
