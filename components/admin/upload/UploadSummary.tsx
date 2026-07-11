interface Props {
    summary: {
        inserted: number;
        updated: number;
        failed: number;
    };
}

export default function UploadSummary({ summary }: Props) {
    return (
        <div className="rounded-lg border bg-green-50 p-5">

            <h2 className="font-semibold mb-4">
                Upload Summary
            </h2>

            <div className="space-y-2">

                <p>Inserted: {summary.inserted}</p>

                <p>Updated: {summary.updated}</p>

                <p>Failed: {summary.failed}</p>

            </div>

        </div>
    );
}