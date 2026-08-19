import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ReviewsLoading() {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label="Loading customer reviews management page"
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8"
        >
            {/* Header Skeleton */}
            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-40 sm:h-10 sm:w-48 rounded-xl" />
                    <Skeleton className="h-4 w-72 sm:w-96 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-28 rounded-xl shrink-0" />
            </header>

            {/* Stats Cards Skeleton */}
            <section aria-label="Loading review summary metrics">
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

            {/* Filter and Table Section */}
            <section aria-label="Loading review management table" className="space-y-4 w-full">
                {/* Search, Filter, and Badge Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
                        {/* Search Input Skeleton */}
                        <Skeleton className="h-11 w-full flex-1 rounded-2xl" />
                        {/* Status Select Skeleton */}
                        <Skeleton className="h-11 w-full sm:w-42.5 shrink-0 rounded-2xl" />
                    </div>
                    {/* Review Count Badge Skeleton */}
                    <Skeleton className="h-6 w-20 rounded-full shrink-0 self-start sm:self-center" />
                </div>

                {/* Table Skeleton */}
                <div className="w-full rounded-2xl border border-border/80 bg-card/90 shadow-xs backdrop-blur-md overflow-hidden flex flex-col">
                    <div className="w-full overflow-x-auto">
                        <Table className="w-full text-left">
                            <TableHeader>
                                <TableRow className="border-b border-border/70 bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="py-3.5 pl-6 w-[30%] min-w-50">
                                        <Skeleton className="h-3.5 w-16 rounded-md" />
                                    </TableHead>
                                    <TableHead className="py-3.5 w-[45%]">
                                        <Skeleton className="h-3.5 w-20 rounded-md" />
                                    </TableHead>
                                    <TableHead className="py-3.5 w-[15%] min-w-32.5">
                                        <Skeleton className="h-3.5 w-14 rounded-md" />
                                    </TableHead>
                                    <TableHead className="py-3.5 pr-6 w-[10%] min-w-12.5 text-right">
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[1, 2, 3, 4, 5].map((row) => (
                                    <TableRow key={row} className="border-b border-border/40">
                                        {/* Product Column */}
                                        <TableCell className="py-4 pl-6 align-top">
                                            <div className="flex gap-3.5">
                                                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                                                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                                                    <Skeleton className="h-4 w-32 rounded-md" />
                                                    <Skeleton className="h-3 w-20 rounded-md" />
                                                    <Skeleton className="h-2.5 w-24 rounded-md mt-0.5" />
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Feedback Column */}
                                        <TableCell className="py-4 align-top max-w-70 sm:max-w-90">
                                            <div className="flex flex-col gap-2 min-w-0 pr-4">
                                                {/* Stars Skeleton */}
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Skeleton key={s} className="h-3.5 w-3.5 rounded-sm" />
                                                    ))}
                                                </div>
                                                <Skeleton className="h-4 w-40 rounded-md" />
                                                <Skeleton className="h-3 w-full max-w-sm rounded-md" />
                                            </div>
                                        </TableCell>

                                        {/* Status Dropdown Skeleton */}
                                        <TableCell className="py-4 align-top whitespace-nowrap">
                                            <Skeleton className="h-8 w-30 rounded-full" />
                                        </TableCell>

                                        {/* Actions Column */}
                                        <TableCell className="py-4 pr-6 text-right align-top">
                                            <Skeleton className="h-8 w-8 rounded-md inline-block ml-auto" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Footer Skeleton */}
                    <div className="border-t border-border/70 px-4 py-3 bg-muted/20 flex items-center justify-between">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-9 w-48 rounded-xl" />
                    </div>
                </div>
            </section>
        </div>
    );
}