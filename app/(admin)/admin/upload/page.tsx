import { Upload, CheckCircle2 } from "lucide-react";
import UploadCSV from "@/components/admin/upload/UploadCSV";

export const metadata = {
    title: "Bulk Product Upload | Furnitureables Admin",
    description: "Quickly add or update store products in bulk using CSV file imports.",
};

export default function UploadPage() {
    return (
        <main
            id="main-content"
            className="space-y-6 sm:space-y-8 max-w-7xl mx-auto"
            role="main"
            aria-labelledby="page-title"
            aria-describedby="page-description"
        >
            {/* Header Landmark */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
                <div className="space-y-2 min-w-0">
                    <h1
                        id="page-title"
                        className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground truncate gap-2.5 py-1"
                    >
                        Bulk Product Upload
                    </h1>
                    <p
                        id="page-description"
                        className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed"
                    >
                        Quickly add multiple products to your store by uploading a CSV file.
                    </p>
                </div>
            </header>

            {/* Upload Section Landmark */}
            <section
                aria-labelledby="upload-section-title"
                aria-describedby="upload-section-desc"
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
                <div className="border-b bg-muted/30 px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                            aria-hidden="true"
                        >
                            <Upload className="size-5" />
                        </div>

                        <div>
                            <h2 id="upload-section-title" className="font-semibold text-foreground">
                                Upload your CSV file
                            </h2>
                            <p id="upload-section-desc" className="mt-1 text-sm text-muted-foreground">
                                Select a CSV file containing your product information to begin the import.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <UploadCSV />
                </div>
            </section>

            {/* Requirements Section Landmark */}
            <section
                aria-labelledby="requirements-section-title"
                className="rounded-2xl border bg-card p-6 shadow-sm"
            >
                <h2 id="requirements-section-title" className="font-semibold text-foreground">
                    Before you upload
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2" role="list" aria-label="CSV upload guidelines checklist">
                    <div className="flex items-start gap-3" role="listitem">
                        <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            aria-hidden="true"
                        />
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Use CSV format
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Make sure your file is saved as .csv.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3" role="listitem">
                        <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            aria-hidden="true"
                        />
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Check your columns
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Ensure the CSV headers match the required product fields.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3" role="listitem">
                        <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            aria-hidden="true"
                        />
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Validate product data
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Review prices, categories, and required fields before importing.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3" role="listitem">
                        <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            aria-hidden="true"
                        />
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Avoid duplicate products
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Check existing products before uploading duplicates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}