import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth/admin";
import { fetchImageAsInlinePart, getGenerativeModel } from "@/lib/ai/gemini";
import { buildProductDetailsPrompt } from "@/lib/ai/prompts";
import { GeminiProductDetails, GenerateRequestBody } from "@/types/ai";

async function generateUniqueSku(skuBase: string): Promise<string> {
    const cleanedBase = (skuBase || "FUR")
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 16) || "FUR";

    for (let attempt = 0; attempt < 6; attempt++) {
        const suffix = Math.random()
            .toString(36)
            .slice(2, 6)
            .toUpperCase();

        const candidate = `${cleanedBase}-${suffix}`;

        const existing = await prisma.product.findUnique({
            where: { sku: candidate },
            select: { id: true },
        });

        if (!existing) {
            return candidate;
        }
    }

    return `${cleanedBase}-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: Request) {
    try {
        const adminUser = await getAdminUser();

        if (!adminUser) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const body: GenerateRequestBody = await request.json();
        const { imageUrl, generateSku, ...context } = body;

        if (!imageUrl) {
            return NextResponse.json(
                { error: "An imageUrl is required to generate product content." },
                { status: 400 }
            );
        }

        const [imagePart, prompt] = await Promise.all([
            fetchImageAsInlinePart(imageUrl),
            Promise.resolve(buildProductDetailsPrompt(context)),
        ]);

        const model = getGenerativeModel();

        const result = await model.generateContent([imagePart, { text: prompt }]);
        const rawText = result.response.text();

        let details: GeminiProductDetails;

        try {
            details = JSON.parse(rawText);
        } catch {
            throw new Error("AI response was not valid JSON.");
        }

        if (!details?.title || !details?.description) {
            throw new Error("AI response was missing required fields.");
        }

        const responsePayload: {
            title: string;
            description: string;
            type?: string;
            material?: string;
            color?: string;
            dimensions?: string;
            sku?: string;
        } = {
            title: details.title.trim(),
            description: details.description.trim(),
            type: details.type?.trim(),
            material: details.material?.trim(),
            color: details.color?.trim(),
            dimensions: details.dimensions?.trim(),
        };

        if (generateSku) {
            responsePayload.sku = await generateUniqueSku(details.skuBase);
        }

        return NextResponse.json({ success: true, ...responsePayload });
    } catch (error) {
        console.error("AI product generation failed:", error);

        const message =
            error instanceof Error ? error.message : "AI generation failed.";

        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
