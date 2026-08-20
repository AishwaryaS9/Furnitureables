import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SKELETON_ROWS = 8;
const STATS_COUNT = 4;

export default function CustomersLoading() {
    return (
        <div
            aria-busy="true"
            aria-live="polite"
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8"
        >
            <span className="sr-only">Loading customers data...</span>

            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-9 sm:h-10 lg:h-11 w-48 rounded-lg" />
                <Skeleton className="h-4 w-full max-w-md rounded-md mt-3" />
            </div>

            {/* Statistics Cards Skeleton */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: STATS_COUNT }).map((_, index) => (
                    <Card
                        key={`stat-skeleton-${index}`}
                        className="rounded-2xl border bg-card/60 backdrop-blur-xl p-5 shadow-xs"
                    >
                        <CardContent className="p-0 space-y-3">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-3.5 w-28 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-24 rounded-md" />
                                <Skeleton className="h-3 w-36 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search and Sort Skeleton */}
            <div className="space-y-4 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full">
                        <Skeleton className="h-11 w-full lg:max-w-md rounded-2xl" />
                        <Skeleton className="h-11 w-full lg:w-56 rounded-2xl shrink-0" />
                    </div>
                </div>

                {/* Table Container Skeleton */}
                <div className="rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table className="w-full min-w-200 text-left">
                            <TableHeader>
                                <TableRow className="border-b border-border/70 bg-muted/50">
                                    <TableHead className="py-3.5 pl-6">
                                        <Skeleton className="h-3.5 w-24 rounded-md" />
                                    </TableHead>
                                    <TableHead className="py-3.5 pl-6">
                                        <Skeleton className="h-3.5 w-28 rounded-md" />
                                    </TableHead>
                                    <TableHead className="py-3.5">
                                        <Skeleton className="h-3.5 w-16 rounded-md" />
                                    </TableHead>
                                    <TableHead className="py-3.5 text-center">
                                        <Skeleton className="h-3.5 w-14 mx-auto rounded-md" />
                                    </TableHead>
                                    <TableHead className="py-3.5">
                                        <Skeleton className="h-3.5 w-20 rounded-md" />
                                    </TableHead>
                                    <TableHead className="py-3.5 text-right">
                                        <Skeleton className="h-3.5 w-20 ml-auto rounded-md" />
                                    </TableHead>
                                    <TableHead className="py-3.5 pr-6 w-12" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                                    <TableRow
                                        key={`table-row-skeleton-${index}`}
                                        className="border-b border-border/40"
                                    >
                                        {/* Customer ID */}
                                        <TableCell className="py-4 pl-6">
                                            <Skeleton className="h-4 w-28 rounded-md" />
                                        </TableCell>

                                        {/* Customer Name & Email */}
                                        <TableCell className="py-4 pl-6">
                                            <div className="space-y-1.5">
                                                <Skeleton className="h-4 w-36 rounded-md" />
                                                <Skeleton className="h-3 w-48 rounded-md" />
                                            </div>
                                        </TableCell>

                                        {/* Joined Date */}
                                        <TableCell className="py-4">
                                            <Skeleton className="h-4 w-20 rounded-md" />
                                        </TableCell>

                                        {/* Orders Badge */}
                                        <TableCell className="py-4 text-center">
                                            <Skeleton className="h-5 w-14 mx-auto rounded-md" />
                                        </TableCell>

                                        {/* Last Order */}
                                        <TableCell className="py-4">
                                            <Skeleton className="h-4 w-20 rounded-md" />
                                        </TableCell>

                                        {/* Total Spent */}
                                        <TableCell className="py-4 text-right">
                                            <Skeleton className="h-4 w-16 ml-auto rounded-md" />
                                        </TableCell>

                                        {/* Actions Menu */}
                                        <TableCell className="py-4 pr-6 text-right">
                                            <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination Skeleton */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-4 w-20 mr-2 hidden sm:inline-block rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}