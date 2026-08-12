import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUploadLoading() {
    return (
        <main
            id="main-content"
            className="space-y-6 sm:space-y-8 max-w-7xl mx-auto"
            role="main"
            aria-busy="true"
            aria-live="polite"
        >
            <span className="sr-only">Loading bulk upload dashboard...</span>

            {/* Header Skeleton */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
                <div className="space-y-2 min-w-0">
                    <Skeleton className="h-9 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-96 rounded-md" />
                </div>
            </header>

            {/* Upload Section Landmark Skeleton */}
            <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="border-b bg-muted/30 px-6 py-5">
                    <div className="flex items-start gap-4">
                        <Skeleton className="size-10 rounded-lg shrink-0" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-5 w-44 rounded-md" />
                            <Skeleton className="h-4 w-72 rounded-md" />
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Dropzone Box Skeleton */}
                    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/80 p-8 sm:p-12 text-center bg-muted/20">
                        <Skeleton className="h-14 w-14 rounded-2xl mb-4" />
                        <Skeleton className="h-5 w-64 rounded-md mb-2" />
                        <Skeleton className="h-4 w-40 rounded-md" />
                    </div>
                </div>
            </section>

            {/* Requirements Section Landmark Skeleton */}
            <section className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                <Skeleton className="h-5 w-36 rounded-md" />

                <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-3 p-2">
                            <Skeleton className="size-4 rounded-full shrink-0 mt-0.5" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-32 rounded-md" />
                                <Skeleton className="h-3 w-full rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}