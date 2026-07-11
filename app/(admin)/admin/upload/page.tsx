import UploadCSV from "@/components/admin/upload/UploadCSV";

export default function UploadPage() {
    return (
        <main className="mx-auto max-w-6xl p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Bulk Product Upload
                </h1>

                <p className="text-muted-foreground mt-2">
                    Upload products using a CSV file.
                </p>
            </div>

            <UploadCSV />
        </main>
    );
}