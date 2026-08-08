import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AddressesLoading() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            aria-busy="true"
            aria-live="polite"
            aria-label="Loading saved delivery addresses"
            className="min-h-screen bg-background text-foreground antialiased focus:outline-none"
        >
            {/* Screen Reader Notification */}
            <span className="sr-only">
                Loading saved addresses. Please wait while your delivery destinations load.
            </span>

            <section
                aria-label="Loading delivery addresses layout"
                className="mx-auto max-w-360 px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8"
            >
                {/* Editorial Header Block Skeleton */}
                <header className="mb-8 sm:mb-12 border-b border-border/60 pb-6 sm:pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-3" aria-hidden="true">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
                            <Skeleton className="h-4 w-32 rounded-md" />
                        </div>
                        <Skeleton className="h-6 w-36 rounded-full" />
                    </div>

                    <Skeleton className="h-9 sm:h-11 lg:h-12 w-3/4 max-w-lg rounded-xl mt-2" aria-hidden="true" />
                    <Skeleton className="h-4 w-full max-w-2xl rounded-md mt-4" aria-hidden="true" />
                    <Skeleton className="h-4 w-2/3 max-w-md rounded-md mt-2" aria-hidden="true" />
                </header>

                {/* Address List Section Skeleton */}
                <div className="space-y-6">
                    {/* Section Toolbar Skeleton */}
                    <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4" aria-hidden="true">
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="h-6 w-36 rounded-md" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-10 w-32 rounded-xl" />
                    </div>

                    {/* 3-Column Address Cards Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" aria-hidden="true">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card
                                key={i}
                                className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 shadow-2xs"
                            >
                                {/* Card Top Row */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1.5 min-w-0">
                                        <Skeleton className="h-4 w-32 rounded-md" />
                                        <Skeleton className="h-3 w-24 rounded-md" />
                                    </div>
                                    <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                                </div>

                                {/* Address Detail Lines */}
                                <div className="space-y-2 pt-2 border-t border-border/40">
                                    <Skeleton className="h-3.5 w-full rounded-md" />
                                    <Skeleton className="h-3.5 w-4/5 rounded-md" />
                                    <Skeleton className="h-3.5 w-3/5 rounded-md" />
                                </div>

                                {/* Card Bottom Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                                    <Skeleton className="h-7 w-24 rounded-lg" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}