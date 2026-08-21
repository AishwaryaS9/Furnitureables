import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ContactLoading() {
    return (
        <div
            aria-busy="true"
            aria-live="polite"
            className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20"
        >
            <span className="sr-only">Loading Contact page...</span>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto space-y-3 flex flex-col items-center">
                    <Skeleton className="h-6 w-36 rounded-full" />
                    <Skeleton className="h-10 sm:h-12 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-full max-w-lg rounded-md" />
                    <Skeleton className="h-4 w-3/4 max-w-md rounded-md" />
                </div>

                {/* Trust Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border/50 bg-card px-4 py-3 text-center shadow-2xs flex flex-col items-center justify-center space-y-1.5"
                        >
                            <Skeleton className="h-5 w-20 rounded-md" />
                            <Skeleton className="h-3 w-24 rounded-md" />
                        </div>
                    ))}
                </div>

                {/* Main Grid: Form + Info Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Contact Form Skeleton */}
                    <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-card shadow-2xs">
                        <CardHeader className="border-b border-border/40 pb-4">
                            <Skeleton className="h-5 w-40 rounded-md" />
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3.5 w-20 rounded-md" />
                                    <Skeleton className="h-9 w-full rounded-xl" />
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3.5 w-24 rounded-md" />
                                    <Skeleton className="h-9 w-full rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-16 rounded-md" />
                                <Skeleton className="h-9 w-full rounded-xl" />
                            </div>

                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-16 rounded-md" />
                                <Skeleton className="h-28 w-full rounded-xl" />
                            </div>

                            <Skeleton className="h-10 w-32 rounded-xl" />
                            <Skeleton className="h-3 w-64 rounded-md" />
                        </CardContent>
                    </Card>

                    {/* Info Sidebar Skeleton */}
                    <div className="space-y-4">
                        <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
                            <CardContent className="p-5 space-y-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-start gap-3 ${i > 0 ? "pt-3 border-t border-border/40" : ""
                                            }`}
                                    >
                                        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                                        <div className="space-y-1.5 flex-1">
                                            <Skeleton className="h-4 w-20 rounded-md" />
                                            <Skeleton className="h-3 w-36 rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Map Skeleton */}
                        <Skeleton className="w-full h-44 rounded-2xl border border-border/60" />
                    </div>
                </div>

                {/* Quick Topics */}
                <div className="max-w-3xl mx-auto text-center space-y-4 flex flex-col items-center">
                    <Skeleton className="h-3.5 w-32 rounded-md" />
                    <div className="flex flex-wrap justify-center gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-28 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}