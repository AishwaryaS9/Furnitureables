// components/legal/LegalPageSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function LegalPageSkeleton() {
    return (
        <div
            aria-busy="true"
            aria-live="polite"
            className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto space-y-3 flex flex-col items-center">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-10 sm:h-12 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-full max-w-md rounded-md" />
                    <Skeleton className="h-3 w-36 rounded-md" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* TOC Sidebar */}
                    <div className="hidden lg:block lg:col-span-1 rounded-2xl border border-border/60 bg-card p-5 space-y-3 shadow-2xs">
                        <Skeleton className="h-3.5 w-24 rounded-md mb-3" />
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-3.5 w-full rounded-md" />
                        ))}
                    </div>

                    {/* Main Legal Content Sections */}
                    <div className="lg:col-span-3 rounded-2xl border border-border/60 bg-card divide-y divide-border/50 shadow-2xs">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-6 sm:p-8 space-y-4">
                                <Skeleton className="h-6 w-48 rounded-md" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3.5 w-full rounded-md" />
                                    <Skeleton className="h-3.5 w-full rounded-md" />
                                    <Skeleton className="h-3.5 w-4/5 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="max-w-2xl mx-auto text-center space-y-2 pt-4 flex flex-col items-center">
                    <Skeleton className="h-4 w-60 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
            </div>
        </div>
    );
}