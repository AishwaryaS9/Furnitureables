import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is not set. Add it to your environment variables to enable AI product generation."
        );
    }

    if (!client) {
        client = new GoogleGenerativeAI(apiKey);
    }

    return client;
}

export const productDetailsSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        title: {
            type: SchemaType.STRING,
            description:
                "A concise, customer-facing product title (max ~8 words), no marketing fluff, no quotes.",
        },
        description: {
            type: SchemaType.STRING,
            description:
                "A persuasive 2-4 sentence product description highlighting design, materials, and use case.",
        },
        skuBase: {
            type: SchemaType.STRING,
            description:
                "A short uppercase alphanumeric SKU base, 6-10 characters, formatted like 'FUR-CHR-OAK' derived from the product category and a distinguishing attribute (e.g. material or color). Letters, numbers, and hyphens only, no spaces.",
        },
        type: {
            type: SchemaType.STRING,
            description:
                "Best-guess furniture category for this item, e.g. 'Chair', 'Sofa', 'Table'.",
        },
        material: {
            type: SchemaType.STRING,
            description: "Best-guess primary material visible in the image.",
        },
        color: {
            type: SchemaType.STRING,
            description: "Best-guess dominant color of the product.",
        },
        dimensions: {
            type: SchemaType.STRING,
            description:
                "A reasonable estimated dimensions string formatted like '45cm x 50cm x 90cm' (width x depth x height), inferred from the item's apparent type/proportions in the image. This is an estimate, not a measurement.",
        },
    },
    required: ["title", "description", "skuBase"],
};

export function getGenerativeModel() {
    return getClient().getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: productDetailsSchema,
            temperature: 0.6,
        },
    });
}

export async function fetchImageAsInlinePart(imageUrl: string) {
    const res = await fetch(imageUrl);

    if (!res.ok) {
        throw new Error(`Failed to fetch product image (status ${res.status}).`);
    }

    const mimeType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    return {
        inlineData: {
            mimeType,
            data: base64Data,
        },
    };
}
