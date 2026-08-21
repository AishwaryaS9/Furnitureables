import { Skeleton } from "@/components/ui/skeleton";

export default function FaqLoading() {
    return (
        <div
            aria-busy="true"
            aria-live="polite"
            className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20"
        >
            <span className="sr-only">Loading Frequently Asked Questions...</span>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto space-y-3 flex flex-col items-center">
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-10 sm:h-12 w-80 rounded-xl" />
                    <Skeleton className="h-4 w-full max-w-lg rounded-md" />
                    <Skeleton className="h-4 w-3/4 max-w-md rounded-md" />
                </div>

                <div className="space-y-10">
                    {/* Search Bar Skeleton */}
                    <div className="max-w-xl mx-auto">
                        <Skeleton className="h-11 w-full rounded-2xl" />
                    </div>

                    {/* Categories Accordions Skeleton */}
                    <div className="space-y-10">
                        {Array.from({ length: 3 }).map((_, catIdx) => (
                            <div key={catIdx} className="space-y-4">
                                <Skeleton className="h-6 w-40 rounded-md" />
                                <div className="rounded-2xl border border-border/60 bg-card px-5 sm:px-6 divide-y divide-border/40 shadow-2xs">
                                    {Array.from({ length: 4 }).map((_, itemIdx) => (
                                        <div key={itemIdx} className="py-4 flex items-center justify-between">
                                            <Skeleton className="h-4 w-3/4 rounded-md" />
                                            <Skeleton className="h-4 w-4 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Footnote */}
                <div className="max-w-2xl mx-auto text-center space-y-2 pt-4 flex flex-col items-center">
                    <Skeleton className="h-4 w-52 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
            </div>
        </div>
    );
}