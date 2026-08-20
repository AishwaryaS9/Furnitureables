import { CreateProductInput, MediaType } from "@/types/product";

function parseImageUrls(raw: string): string[] {
    if (!raw) return [];

    const delimiter = raw.includes("|") ? "|" : ",";

    return raw
        .split(delimiter)
        .map((url) => url.trim())
        .filter(Boolean);
}

export function parseProductsCSV(
    rows: Record<string, string>[]
): CreateProductInput[] {
    return rows.map((row) => {
        const rawImages = row.image || row.images || "";
        const imageUrls = parseImageUrls(rawImages);

        return {
            title: row.title,
            description: row.description || "",
            price: Number(row.price),
            stock: Number(row.stock),
            sku: row.sku,
            type: row.type,
            material: row.material,
            color: row.color,
            room: row.room,
            dimensions: row.dimensions,

            media: imageUrls.map((url, index) => ({
                url,
                type: "IMAGE" as MediaType,
                sortOrder: index,
            })),
        };
    });
}