import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function ChartCardSkeleton() {
    return (
        <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl shadow-xs min-h-88 flex flex-col">
            <CardContent className="p-5 sm:p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <Skeleton className="h-4 w-40 rounded-md" />
                        <Skeleton className="h-3 w-56 rounded-md" />
                    </div>
                    <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                </div>
                <Skeleton className="h-72 w-full rounded-xl flex-1" />
            </CardContent>
        </Card>
    );
}

export default function AnalyticsLoading() {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label="Loading analytics dashboard"
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8"
        >
            {/* Header Skeleton */}
            <header className="space-y-2">
                <Skeleton className="h-9 w-40 sm:h-10 sm:w-48 rounded-xl" />
                <Skeleton className="h-4 w-72 sm:w-96 rounded-lg" />
            </header>

            {/* KPI Cards Skeleton */}
            <section aria-label="Loading key metrics">
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card
                            key={i}
                            className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 shadow-xs"
                        >
                            <CardContent className="p-0 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-3.5 w-20 rounded-md" />
                                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton className="h-8 w-16 rounded-md" />
                                    <Skeleton className="h-3 w-28 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Chart Grid Skeletons */}
            <section aria-label="Loading charts" className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                    <ChartCardSkeleton />
                </div>
                <ChartCardSkeleton />
            </section>

            <section aria-label="Loading charts" className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <ChartCardSkeleton />
                <ChartCardSkeleton />
                <ChartCardSkeleton />
            </section>

            <section aria-label="Loading charts" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <ChartCardSkeleton />
                <ChartCardSkeleton />
            </section>
        </div>
    );
}
