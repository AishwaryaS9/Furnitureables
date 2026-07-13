import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded." },
                { status: 400 }
            );
        }

        const blob = await put(file.name, file, {
            access: "public",
            addRandomSuffix: true,
        });

        return NextResponse.json({
            success: true,
            url: blob.url,
            pathname: blob.pathname,
        });
    } catch (error) {
        console.error("Blob upload failed:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Image upload failed.",
            },
            {
                status: 500,
            }
        );
    }
}