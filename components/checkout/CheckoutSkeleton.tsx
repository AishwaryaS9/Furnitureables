"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSkeleton() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            {/* Heading */}
            <Skeleton className="mb-8 h-10 w-56" />

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Left */}
                <div className="space-y-8 lg:col-span-2">
                    {/* Address */}
                    <div className="rounded-2xl border p-6">
                        <Skeleton className="mb-6 h-6 w-48" />

                        <div className="space-y-5">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-xl border p-5"
                                >
                                    <Skeleton className="mb-3 h-5 w-40" />
                                    <Skeleton className="mb-2 h-4 w-48" />
                                    <Skeleton className="mb-2 h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-2xl border p-6">
                        <Skeleton className="mb-6 h-6 w-44" />

                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full rounded-xl" />
                            <Skeleton className="h-16 w-full rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Right Summary */}
                <div className="rounded-2xl border p-6">
                    <Skeleton className="mb-6 h-6 w-36" />

                    <div className="space-y-5">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-4"
                            >
                                <Skeleton className="h-16 w-16 rounded-lg" />

                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}

                        <div className="space-y-3 border-t pt-5">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                            </div>

                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-16" />
                            </div>

                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </div>

                        <Skeleton className="mt-6 h-11 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}