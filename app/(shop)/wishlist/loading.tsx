import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="mt-3 h-5 w-80" />
            </div>

            {/* Wishlist Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-xl border bg-card"
                    >
                        {/* Product Image */}
                        <Skeleton className="aspect-square w-full" />

                        <div className="space-y-4 p-4">
                            {/* Title */}
                            <Skeleton className="h-5 w-3/4" />

                            {/* Price */}
                            <Skeleton className="h-5 w-20" />

                            {/* Buttons */}
                            <div className="flex gap-2 pt-2">
                                <Skeleton className="h-10 flex-1 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}