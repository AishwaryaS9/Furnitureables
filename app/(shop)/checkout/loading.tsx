import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function CheckoutLoading() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            aria-busy="true"
            aria-live="polite"
            aria-label="Loading checkout page details"
            className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 focus:outline-none"
        >
            {/* Screen Reader Notification */}
            <span className="sr-only">
                Loading checkout details. Please wait while your addresses and order breakdown load.
            </span>

            {/* Page Title & Breadcrumb Skeleton */}
            <div className="space-y-2 mb-8" aria-hidden="true">
                <Skeleton className="h-4 w-32 rounded-lg" />
                <Skeleton className="h-8 sm:h-10 w-48 rounded-xl" />
            </div>

            {/* Main 2-Column Checkout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Left Column: Form Sections (Addresses & Payment) */}
                <div className="lg:col-span-7 space-y-8">

                    {/* Address Selector Skeleton */}
                    <section
                        aria-label="Loading saved shipping addresses"
                        className="space-y-5"
                    >
                        <div className="flex items-center justify-between border-b border-border/50 pb-4" aria-hidden="true">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40 rounded-lg" />
                                <Skeleton className="h-3.5 w-64 rounded-md" />
                            </div>
                            <Skeleton className="h-9 w-28 rounded-xl" />
                        </div>

                        {/* Address Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-hidden="true">
                            {[1, 2].map((i) => (
                                <Card key={i} className="rounded-2xl border-border/60 p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-28 rounded-md" />
                                            <Skeleton className="h-3 w-20 rounded-md" />
                                        </div>
                                        <Skeleton className="h-4 w-12 rounded-full" />
                                    </div>
                                    <div className="space-y-1.5 pt-2 border-t border-border/40">
                                        <Skeleton className="h-3.5 w-full rounded-md" />
                                        <Skeleton className="h-3.5 w-3/4 rounded-md" />
                                        <Skeleton className="h-3.5 w-1/2 rounded-md" />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Skeleton className="h-8 w-16 rounded-xl" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Payment Method Selector Skeleton */}
                    <section
                        aria-label="Loading payment method options"
                        className="space-y-5 pt-4"
                    >
                        <div className="border-b border-border/50 pb-4 space-y-2" aria-hidden="true">
                            <Skeleton className="h-6 w-36 rounded-lg" />
                            <Skeleton className="h-3.5 w-72 rounded-md" />
                        </div>

                        <div className="space-y-3" aria-hidden="true">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="rounded-2xl border-border/60 p-4 sm:p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3.5 w-full">
                                            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                                            <div className="space-y-2 w-full max-w-sm">
                                                <Skeleton className="h-4 w-32 rounded-md" />
                                                <Skeleton className="h-3 w-full rounded-md" />
                                            </div>
                                        </div>
                                        <Skeleton className="w-5 h-5 rounded-full shrink-0 mt-1" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary Sidebar Skeleton */}
                <div className="lg:col-span-5 lg:sticky lg:top-8">
                    <aside
                        aria-label="Loading order breakdown summary"
                        className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs"
                    >
                        {/* Summary Header */}
                        <div className="flex items-center justify-between border-b border-border/50 pb-4" aria-hidden="true">
                            <Skeleton className="h-6 w-32 rounded-lg" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>

                        {/* Collapsible Order Item Preview Card Skeleton */}
                        <div className="rounded-2xl border border-border/50 p-4 flex items-center justify-between bg-secondary/20" aria-hidden="true">
                            <Skeleton className="h-4 w-40 rounded-md" />
                            <Skeleton className="h-4 w-4 rounded-md" />
                        </div>

                        {/* Breakdown Ledger Skeletons */}
                        <div className="space-y-3.5" aria-hidden="true">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-3.5 w-16 rounded-md" />
                                <Skeleton className="h-3.5 w-20 rounded-md" />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-border/40">
                                <Skeleton className="h-3.5 w-28 rounded-md" />
                                <Skeleton className="h-3.5 w-12 rounded-md" />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-border/40">
                                <Skeleton className="h-3.5 w-24 rounded-md" />
                                <Skeleton className="h-3.5 w-16 rounded-md" />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-border/40">
                                <Skeleton className="h-3.5 w-28 rounded-md" />
                                <Skeleton className="h-5 w-24 rounded-lg" />
                            </div>

                            {/* Total Row */}
                            <div className="flex justify-between items-end pt-4 border-t border-border/80">
                                <Skeleton className="h-6 w-24 rounded-lg" />
                                <Skeleton className="h-7 w-32 rounded-lg" />
                            </div>
                        </div>

                        {/* Place Order CTA Skeleton */}
                        <div className="pt-2 space-y-3" aria-hidden="true">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-3 w-48 mx-auto rounded-md" />
                        </div>

                        {/* Trust Badge Skeleton */}
                        <div className="pt-2 border-t border-border/30 flex justify-center" aria-hidden="true">
                            <Skeleton className="h-4 w-44 rounded-md" />
                        </div>
                    </aside>
                </div>

            </div>
        </main>
    );
}