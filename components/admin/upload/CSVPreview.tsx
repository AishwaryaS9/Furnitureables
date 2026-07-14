import { CreateProductInput } from "@/types/product";

interface Props {
    rows: CreateProductInput[];
}

export default function CSVPreview({ rows }: Props) {
    if (!rows.length) return null;

    const headers = Object.keys(rows[0]) as Array<keyof CreateProductInput>;

    return (
        <div className="overflow-auto rounded border">
            <table className="w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                className="border px-4 py-2 text-left"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                            {headers.map((header) => (
                                <td
                                    key={String(header)}
                                    className="border px-4 py-2"
                                >
                                    {header === "media"
                                        ? row.media
                                            ?.map((m) => `${m.type}: ${m.url}`)
                                            .join(", ")
                                        : String(row[header] ?? "")}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {rows.length > 10 && (
                <p className="p-4 text-sm text-gray-500">
                    Showing first 10 of {rows.length} rows
                </p>
            )}
        </div>
    );
}