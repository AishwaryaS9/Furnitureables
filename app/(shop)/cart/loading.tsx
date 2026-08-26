import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
    return (
        <main
            className="min-h-screen bg-background text-foreground antialiased"
            role="status"
            aria-busy="true"
            aria-label="Loading cart"
        >
            <span className="sr-only">Loading your cart…</span>

            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
                {/* Breadcrumb Skeleton */}
                <Skeleton className="h-4 w-40 mb-6" aria-hidden="true" />

                {/* Header Skeleton */}
                <div
                    className="border-b border-border/60 pb-6 mb-8 sm:mb-10 flex flex-row items-center justify-between gap-4"
                    aria-hidden="true"
                >
                    <div className="space-y-3 min-w-0">
                        <Skeleton className="h-8 sm:h-11 w-40 sm:w-56" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-4 w-32 shrink-0" />
                </div>

                {/* Active Cart Grid Skeleton */}
                <div
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 lg:items-start"
                    aria-hidden="true"
                >
                    {/* Left Column: Cart Items */}
                    <section className="lg:col-span-7 xl:col-span-8 bg-card border border-border/60 rounded-2xl px-4 sm:px-6 py-2 divide-y divide-border/60 shadow-xs">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="py-5 flex gap-4">
                                <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-3 py-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3.5 w-1/3" />
                                    <div className="flex items-center gap-3 pt-2">
                                        <Skeleton className="h-8 w-24 rounded-lg" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Right Column: Order Summary */}
                    <aside className="lg:col-span-5 xl:col-span-4 space-y-4">
                        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
                            <Skeleton className="h-5 w-32" />
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3.5 w-20" />
                                    <Skeleton className="h-3.5 w-14" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-3.5 w-24" />
                                    <Skeleton className="h-3.5 w-14" />
                                </div>
                                <div className="flex justify-between pt-3 border-t border-border/60">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
