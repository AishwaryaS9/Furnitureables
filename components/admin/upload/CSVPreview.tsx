"use client";

import { useState } from "react";
import { CreateProductInput } from "@/types/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileSpreadsheet } from "lucide-react";

interface Props {
    rows: CreateProductInput[];
}

const PAGE_SIZE = 8;

export default function CSVPreview({ rows }: Props) {
    const [currentPage, setCurrentPage] = useState(1);

    if (!rows.length) return null;

    const headers = Object.keys(rows[0]) as Array<keyof CreateProductInput>;
    const totalItems = rows.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const paginatedRows = rows.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const startItem = (currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(currentPage * PAGE_SIZE, totalItems);

    const renderCellValue = (header: keyof CreateProductInput, value: any) => {
        if (value === null || value === undefined || value === "") {
            return <span className="text-muted-foreground/50 italic" aria-label="Empty value">—</span>;
        }

        if (header === "media" && Array.isArray(value)) {
            return (
                <div className="flex flex-wrap gap-1 max-w-xs" aria-label="Media items">
                    {value.map((m, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0.5 rounded-md font-normal">
                            {m.type}: {m.url}
                        </Badge>
                    ))}
                </div>
            );
        }

        if (typeof value === "object") {
            return <span className="font-mono text-xs">{JSON.stringify(value)}</span>;
        }

        return String(value);
    };

    return (
        <Card
            className="rounded-3xl border-border/60 bg-card/60 backdrop-blur-xl shadow-xs overflow-hidden"
            role="region"
            aria-labelledby="csv-preview-title"
        >
            <CardHeader className="flex flex-row justify-between border-b">
                <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="h-5 w-5 text-primary" aria-hidden="true" />
                    <CardTitle id="csv-preview-title" className="text-base font-bold text-foreground">
                        Parsed Data Preview
                    </CardTitle>
                </div>
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary font-semibold text-xs border-none px-3 py-1">
                    {totalItems} Row{totalItems > 1 ? "s" : ""} Found
                </Badge>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto" tabIndex={0} aria-label="CSV parsed preview table container">
                    <Table aria-label="Parsed CSV product data preview">
                        <TableHeader>
                            <TableRow className="border-b border-border/60 bg-muted/40 hover:bg-muted/40">
                                <TableHead className="w-12 pl-6 py-3.5 text-xs font-semibold text-muted-foreground" scope="col">
                                    <span className="sr-only">Row Number</span>#
                                </TableHead>
                                {headers.map((header) => (
                                    <TableHead
                                        key={String(header)}
                                        scope="col"
                                        className="py-3.5 px-4 text-xs font-semibold text-foreground capitalize whitespace-nowrap"
                                    >
                                        {String(header)}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedRows.map((row, index) => {
                                const rowIndex = (currentPage - 1) * PAGE_SIZE + index + 1;
                                return (
                                    <TableRow
                                        key={index}
                                        className="border-b border-border/40 transition-colors hover:bg-muted/30"
                                    >
                                        <TableCell className="pl-6 py-3 text-xs font-mono text-muted-foreground">
                                            {rowIndex}
                                        </TableCell>
                                        {headers.map((header) => (
                                            <TableCell
                                                key={String(header)}
                                                className="py-3 px-4 text-xs text-foreground max-w-xs truncate"
                                            >
                                                {renderCellValue(header, row[header])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Footer Landmark */}
                {totalPages > 1 && (
                    <nav
                        role="navigation"
                        aria-label="CSV preview data pagination"
                        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/40 bg-muted/10"
                    >
                        <div
                            aria-live="polite"
                            aria-atomic="true"
                            className="text-xs text-muted-foreground font-medium"
                        >
                            Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
                            <span className="font-semibold text-foreground">{endItem}</span> of{" "}
                            <span className="font-semibold text-foreground">{totalItems}</span> rows
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground font-medium mr-2 hidden sm:inline-block" aria-hidden="true">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                aria-label="Go to first page of CSV preview"
                                aria-disabled={currentPage === 1}
                                className="h-8 w-8 rounded-xl border-border/80 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
                                <span className="sr-only">First Page</span>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                aria-label="Go to previous page of CSV preview"
                                aria-disabled={currentPage === 1}
                                className="h-8 w-8 rounded-xl border-border/80 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                <span className="sr-only">Previous Page</span>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage >= totalPages}
                                aria-label="Go to next page of CSV preview"
                                aria-disabled={currentPage >= totalPages}
                                className="h-8 w-8 rounded-xl border-border/80 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                <span className="sr-only">Next Page</span>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage >= totalPages}
                                aria-label={`Go to last page (Page ${totalPages}) of CSV preview`}
                                aria-disabled={currentPage >= totalPages}
                                className="h-8 w-8 rounded-xl border-border/80 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <ChevronsRight className="h-4 w-4" aria-hidden="true" />
                                <span className="sr-only">Last Page</span>
                            </Button>
                        </div>
                    </nav>
                )}
            </CardContent>
        </Card>
    );
}