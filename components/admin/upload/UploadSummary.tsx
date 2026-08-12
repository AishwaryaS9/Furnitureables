import { CheckCircle2, RefreshCw, AlertCircle, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
    summary: {
        inserted: number;
        updated: number;
        failed: number;
    };
}

export default function UploadSummary({ summary }: Props) {
    const totalProcessed = summary.inserted + summary.updated + summary.failed;

    return (
        <Card
            className="rounded-3xl border-border/60 bg-card/60 backdrop-blur-xl shadow-xs overflow-hidden"
            role="region"
            aria-labelledby="upload-summary-title"
            aria-live="polite"
            aria-atomic="true"
        >
            <CardHeader className="flex flex-row justify-between border-b">
                <div className="flex items-center gap-2.5">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/15 text-success shadow-2xs"
                        aria-hidden="true"
                    >
                        <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle id="upload-summary-title" className="text-base font-bold text-foreground">
                            Import Summary
                        </CardTitle>
                        <p className="text-xs text-muted-foreground font-medium">
                            Processing results for {totalProcessed} CSV row{totalProcessed === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>

                {summary.failed === 0 ? (
                    <Badge
                        className="rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-3 py-1"
                        aria-label="Upload status: Completed Successfully"
                    >
                        Completed Successfully
                    </Badge>
                ) : (
                    <Badge
                        className="rounded-full bg-amber-500/10 text-amber-600  border-amber-500/20 font-semibold px-3 py-1"
                        aria-label="Upload status: Completed with Warnings"
                    >
                        Completed with Warnings
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="p-6">
                <div
                    className="grid gap-4 sm:grid-cols-3"
                    role="list"
                    aria-label="CSV processing metric summary"
                >
                    {/* Inserted Metric Card */}
                    <div
                        className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
                        role="listitem"
                        aria-label={`${summary.inserted} new records inserted`}
                    >
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600"
                            aria-hidden="true"
                        >
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-emerald-700">
                                New Inserted
                            </p>
                            <p className="text-2xl font-bold text-emerald-950">
                                {summary.inserted}
                            </p>
                        </div>
                    </div>

                    {/* Updated Metric Card */}
                    <div
                        className="flex items-center gap-3.5 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20"
                        role="listitem"
                        aria-label={`${summary.updated} existing records updated`}
                    >
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600"
                            aria-hidden="true"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-blue-700">
                                Records Updated
                            </p>
                            <p className="text-2xl font-bold text-blue-950">
                                {summary.updated}
                            </p>
                        </div>
                    </div>

                    {/* Failed Metric Card */}
                    <div
                        className="flex items-center gap-3.5 p-4 rounded-2xl bg-destructive/10 border border-destructive/20"
                        role="listitem"
                        aria-label={`${summary.failed} rows failed processing`}
                    >
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/20 text-destructive"
                            aria-hidden="true"
                        >
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-destructive">
                                Failed Rows
                            </p>
                            <p className="text-2xl font-bold text-destructive">
                                {summary.failed}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}