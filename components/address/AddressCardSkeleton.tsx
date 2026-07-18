export default function AddressCardSkeleton() {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 animate-pulse">

            <div className="flex items-start justify-between">

                <div className="space-y-3">

                    <div className="h-5 w-40 rounded bg-zinc-200" />

                    <div className="h-4 w-28 rounded bg-zinc-100" />

                </div>

                <div className="h-7 w-20 rounded-full bg-zinc-200" />

            </div>

            <div className="mt-6 space-y-3">

                <div className="h-4 w-full rounded bg-zinc-100" />

                <div className="h-4 w-5/6 rounded bg-zinc-100" />

                <div className="h-4 w-2/3 rounded bg-zinc-100" />

                <div className="h-4 w-1/2 rounded bg-zinc-100" />

            </div>

            <div className="mt-6 flex gap-3">

                <div className="h-9 w-20 rounded-lg bg-zinc-200" />

                <div className="h-9 w-24 rounded-lg bg-zinc-200" />

                <div className="h-9 w-28 rounded-lg bg-zinc-200" />

            </div>

        </div>
    );
}