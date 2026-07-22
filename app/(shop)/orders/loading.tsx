import { Skeleton } from "@/components/ui/skeleton";

function OrderCardSkeleton() {
    return (
        <div className="rounded-2xl border bg-card p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-56" />

                    <div className="flex gap-2 pt-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </div>

                <div className="space-y-2 text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                    <Skeleton className="ml-auto h-8 w-28" />
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <Skeleton className="h-16 w-16 rounded-lg" />
                <Skeleton className="h-16 w-16 rounded-lg" />
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <section className="container mx-auto max-w-6xl py-10">
            <div className="mb-8 space-y-3">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-5 w-80" />
            </div>

            <div className="space-y-5">
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
            </div>
        </section>
    );
}