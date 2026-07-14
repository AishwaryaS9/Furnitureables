import { CreateProductInput } from "@/types/product";

export function parseProductsCSV(
    rows: Record<string, string>[]
): CreateProductInput[] {
    return rows.map((row) => ({
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

        media: row.image
            ? [
                {
                    url: row.image,
                    type: "IMAGE",
                    sortOrder: 0,
                },
            ]
            : [],
    }));
}