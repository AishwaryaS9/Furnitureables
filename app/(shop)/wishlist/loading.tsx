import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="status"
            aria-label="Loading wishlist items"
            className="min-h-screen bg-background text-foreground antialiased"
        >
            <span className="sr-only">Loading wishlist content...</span>

            <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

                {/* Breadcrumb Skeleton */}
                <div className="mb-6 flex items-center gap-2">
                    <Skeleton className="h-3.5 w-12 rounded-sm" />
                    <span className="text-xs text-border">/</span>
                    <Skeleton className="h-3.5 w-16 rounded-sm" />
                </div>

                {/* Header Skeleton */}
                <div className="max-w-3xl mb-10 sm:mb-12 space-y-3">
                    <Skeleton className="h-7 w-28 rounded-full" />
                    <Skeleton className="h-10 sm:h-12 w-64 sm:w-80 rounded-xl" />
                    <Skeleton className="h-4 w-full sm:w-96 rounded-md" />
                </div>

                {/* Wishlist Grid Skeleton */}
                <div
                    aria-hidden="true"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                >
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-0 shadow-xs"
                        >
                            {/* Image Canvas Skeleton */}
                            <div className="relative aspect-square w-full p-4 bg-secondary/30">
                                <Skeleton className="h-full w-full rounded-xl" />
                            </div>

                            {/* Details Skeleton Block */}
                            <div className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-1/3 rounded-sm" />
                                    <Skeleton className="h-4 w-3/4 rounded-md" />
                                    <Skeleton className="h-5 w-1/2 rounded-md" />
                                </div>

                                {/* Button Skeleton */}
                                <div className="pt-2 border-t border-border/60">
                                    <Skeleton className="h-10 w-full rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}