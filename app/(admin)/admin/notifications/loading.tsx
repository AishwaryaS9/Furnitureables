import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function NotificationsLoading() {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label="Loading notifications page"
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8"
        >
            {/* Header Skeleton */}
            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-52 sm:h-10 sm:w-60 rounded-xl" />
                    <Skeleton className="h-4 w-72 sm:w-96 rounded-lg" />
                </div>
                <div className="flex items-center gap-2.5">
                    <Skeleton className="h-10 w-32 rounded-xl shrink-0" />
                    <Skeleton className="h-10 w-28 rounded-xl shrink-0" />
                </div>
            </header>

            {/* Badge Bar */}
            <div className="flex items-center justify-end">
                <Skeleton className="h-6 w-40 rounded-full shrink-0" />
            </div>

            {/* Table Skeleton */}
            <div className="w-full rounded-2xl border border-border/80 bg-card/90 shadow-xs backdrop-blur-md overflow-hidden flex flex-col">
                <div className="w-full overflow-x-auto">
                    <Table className="w-full text-left">
                        <TableHeader>
                            <TableRow className="border-b border-border/70 bg-muted/50 hover:bg-muted/50">
                                <TableHead className="py-3.5 pl-6 w-[45%] min-w-60">
                                    <Skeleton className="h-3.5 w-24 rounded-md" />
                                </TableHead>
                                <TableHead className="py-3.5 w-[20%] min-w-32">
                                    <Skeleton className="h-3.5 w-16 rounded-md" />
                                </TableHead>
                                <TableHead className="py-3.5 w-[15%] min-w-28">
                                    <Skeleton className="h-3.5 w-14 rounded-md" />
                                </TableHead>
                                <TableHead className="py-3.5 pr-6 w-[20%] min-w-32 text-right">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4, 5, 6].map((row) => (
                                <TableRow key={row} className="border-b border-border/40">
                                    <TableCell className="py-4 pl-6 align-top">
                                        <div className="flex gap-3.5">
                                            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                                            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                                                <Skeleton className="h-4 w-40 rounded-md" />
                                                <Skeleton className="h-3 w-56 rounded-md" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 align-top">
                                        <Skeleton className="h-3.5 w-24 rounded-md" />
                                    </TableCell>
                                    <TableCell className="py-4 align-top">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </TableCell>
                                    <TableCell className="py-4 pr-6 text-right align-top">
                                        <Skeleton className="h-8 w-24 rounded-lg inline-block ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="border-t border-border/70 px-4 py-3 bg-muted/20 flex items-center justify-between">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-9 w-48 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
