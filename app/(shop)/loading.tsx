import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
    return (
        <main
            className="min-h-screen bg-background text-foreground antialiased"
            role="status"
            aria-busy="true"
            aria-label="Loading page"
        >
            <span className="sr-only">Loading…</span>

            {/* Hero Skeleton */}
            <section className="relative min-h-162.5 h-[85vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden rounded-b-[2.5rem]">
                <Skeleton className="absolute inset-0 rounded-b-[2.5rem]" aria-hidden="true" />

                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-360 mx-auto w-full px-5 sm:px-8 lg:px-10">
                        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl space-y-5" aria-hidden="true">
                            <Skeleton className="h-7 w-52 rounded-full bg-background/20" />
                            <Skeleton className="h-14 sm:h-20 md:h-24 w-full max-w-2xl bg-background/20" />
                            <Skeleton className="h-14 sm:h-16 w-2/3 max-w-lg bg-background/20" />
                            <Skeleton className="h-4 w-full max-w-md bg-background/20" />
                            <Skeleton className="h-4 w-3/4 max-w-sm bg-background/20" />
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Skeleton className="h-14 w-48 rounded-xl bg-background/20" />
                                <Skeleton className="h-14 w-48 rounded-xl bg-background/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Collection Skeleton */}
            <section className="py-14 md:py-20 px-5 sm:px-6 lg:px-10">
                <div className="max-w-360 mx-auto space-y-12">
                    <div className="text-center space-y-3 max-w-2xl mx-auto" aria-hidden="true">
                        <Skeleton className="h-9 w-72 mx-auto" />
                        <Skeleton className="h-4 w-full max-w-md mx-auto" />
                        <Skeleton className="h-4 w-2/3 max-w-sm mx-auto" />
                    </div>

                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 pt-4"
                        aria-hidden="true"
                    >
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-4/5 w-full rounded-2xl border border-border/20" />
                                <div className="space-y-3 px-1">
                                    <Skeleton className="h-4 w-3/4 rounded-md" />
                                    <Skeleton className="h-3.5 w-1/4 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex justify-center" aria-hidden="true">
                        <Skeleton className="h-12 w-48 rounded-xl" />
                    </div>
                </div>
            </section>
        </main>
    );
}
