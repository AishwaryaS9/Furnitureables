import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {/* Page Context Header Skeleton */}
            <header className="space-y-1 sm:space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                        <Skeleton className="h-9 w-48 rounded-lg" />
                        <Skeleton className="h-4 w-72 rounded-md" />
                    </div>
                    {/* Action Button Skeleton (e.g. "Add Product") */}
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
            </header>

            {/* Filters and Search Bar Row Skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Skeleton className="h-10 w-full sm:w-80 rounded-xl" />
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Skeleton className="h-10 w-28 rounded-xl" />
                    <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
            </div>

            {/* Products Table Card Skeleton */}
            <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl shadow-xs">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 sm:p-6 pb-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-32 rounded-md" />
                        <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-9 w-9 rounded-xl" />
                </CardHeader>

                <CardContent className="p-5 sm:p-6 pt-0">
                    <div className="space-y-4">
                        {/* Table Header Row Skeleton */}
                        <div className="flex items-center justify-between py-2 border-b border-border/60">
                            <Skeleton className="h-4 w-24 rounded-md" />
                            <Skeleton className="h-4 w-36 rounded-md" />
                            <Skeleton className="h-4 w-20 rounded-md hidden sm:block" />
                            <Skeleton className="h-4 w-16 rounded-md hidden md:block" />
                            <Skeleton className="h-4 w-20 rounded-md text-right" />
                        </div>

                        {/* Table Body Rows Skeleton (Simulating 5 rows) */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-40 rounded-md" />
                                        <Skeleton className="h-3 w-24 rounded-md" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-20 rounded-md hidden sm:block" />
                                <Skeleton className="h-5 w-16 rounded-full hidden md:block" />
                                <Skeleton className="h-5 w-16 rounded-md" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}