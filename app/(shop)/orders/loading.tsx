import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROW_COUNT = 5;

export default function Loading() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="min-h-screen bg-background text-foreground antialiased focus:outline-none"
        >
            <div
                role="status"
                aria-live="polite"
                aria-busy="true"
                className="mx-auto max-w-360 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
            >
                <span className="sr-only">Loading your orders…</span>

                <div aria-hidden="true">
                    {/* Breadcrumb */}
                    <Skeleton className="mb-6 h-4 w-40" />

                    {/* Editorial header block */}
                    <div className="mb-8 border-b border-border/60 pb-6 sm:mb-12 sm:pb-8">
                        <div className="mb-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8 shrink-0 rounded-xl" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-6 w-36 self-start rounded-full sm:self-auto" />
                        </div>

                        <Skeleton className="h-9 w-56 sm:h-10 sm:w-72 lg:h-12 lg:w-96" />

                        <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
                        <Skeleton className="mt-2 h-4 w-2/3 max-w-2xl" />
                    </div>

                    <div className="space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-col justify-between gap-3 border-b border-border/40 pb-4 sm:flex-row sm:items-center">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        </div>

                        {/* Orders feed */}
                        <div className="space-y-4 sm:space-y-5">
                            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
                                <div
                                    key={index}
                                    className="border-b border-border/60 py-6 first:pt-0 last:border-b-0"
                                >
                                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                        {/* Left group: identity/status + thumbnails, mirrors OrderCard */}
                                        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">

                                            {/* Order identity, date & status */}
                                            <div className="min-w-0 shrink-0 space-y-2.5">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Skeleton className="h-5 w-28" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Skeleton className="h-6 w-24 rounded-full" />
                                                    <Skeleton className="h-6 w-24 rounded-full" />
                                                </div>
                                            </div>

                                            {/* Product thumbnails preview */}
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <Skeleton className="h-12 w-12 shrink-0 rounded-xl sm:h-14 sm:w-14" />
                                                <Skeleton className="h-12 w-12 shrink-0 rounded-xl sm:h-14 sm:w-14" />
                                                <Skeleton className="h-12 w-12 shrink-0 rounded-xl sm:h-14 sm:w-14" />
                                            </div>
                                        </div>

                                        {/* Total ledger & action link */}
                                        <div className="flex items-center justify-between gap-6 border-t border-border/30 pt-4 md:justify-end md:border-t-0 md:pt-0">
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-20 md:ml-auto" />
                                                <Skeleton className="h-3 w-14 md:ml-auto" />
                                            </div>
                                            <Skeleton className="h-9 w-28 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}