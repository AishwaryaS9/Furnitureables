import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProductsLoading() {
    return (
        <div
            className="space-y-6 sm:space-y-8 max-w-7xl mx-auto"
            aria-busy="true"
            aria-live="polite"
        >
            <span className="sr-only">Loading products dashboard...</span>

            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-36 rounded-xl" />
            </div>

            {/* Stats Skeleton Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-2xl" />
                ))}
            </div>

            {/* Search Bar Skeleton */}
            <Skeleton className="h-11 w-full max-w-md rounded-xl" />

            {/* Table Skeleton */}
            <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
    );
}