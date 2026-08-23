import fs from "fs";
import path from "path";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import { Order } from "@/types/order";
import { InvoiceDocument } from "@/components/orders/invoice/pdf/InvoicePdf";

let fontsRegistered = false;

function toFontDataUri(buffer: Buffer) {
    return `data:font/ttf;base64,${buffer.toString("base64")}`;
}

function registerServerFonts() {
    if (fontsRegistered) {
        console.log("[invoice-pdf] Fonts already registered");
        return;
    }

    const fontsDir = path.join(
        process.cwd(),
        "public",
        "fonts"
    );

    const regularFontPath = path.join(
        fontsDir,
        "DejaVuSans.ttf"
    );

    const boldFontPath = path.join(
        fontsDir,
        "DejaVuSans-Bold.ttf"
    );

    if (!fs.existsSync(regularFontPath)) {
        throw new Error(
            `Regular font not found: ${regularFontPath}`
        );
    }

    if (!fs.existsSync(boldFontPath)) {
        throw new Error(
            `Bold font not found: ${boldFontPath}`
        );
    }

    Font.register({
        family: "DejaVu",
        fonts: [
            {
                src: toFontDataUri(
                    fs.readFileSync(regularFontPath)
                ),
                fontWeight: 400,
            },
            {
                src: toFontDataUri(
                    fs.readFileSync(boldFontPath)
                ),
                fontWeight: 700,
            },
        ],
    });

    fontsRegistered = true;
}

let cachedLogoDataUri: string | null | undefined;

function getLogoDataUri(): string | null {
    if (cachedLogoDataUri !== undefined) {
        return cachedLogoDataUri;
    }

    try {
        const logoPath = path.join(
            process.cwd(),
            "public",
            "logo.svg"
        );

        if (!fs.existsSync(logoPath)) {
            console.error("Logo file does not exist:", logoPath);
            cachedLogoDataUri = null;
            return cachedLogoDataUri;
        }

        const svg = fs.readFileSync(
            logoPath,
            "utf-8"
        );

        cachedLogoDataUri =
            `data:image/svg+xml;base64,${Buffer.from(
                svg,
                "utf-8"
            ).toString("base64")}`;

    } catch (error) {
        console.error("Failed to read logo asset:", error);
        cachedLogoDataUri = null;
    }

    return cachedLogoDataUri;
}

export async function renderInvoicePdfBuffer(
    order: Order
): Promise<Buffer> {
    try {
        registerServerFonts();

        const logoSrc = getLogoDataUri();

        const pdfBuffer = (await renderToBuffer(
            <InvoiceDocument
                order={order}
                logoSrc={logoSrc ?? ""}
            />
        )) as unknown as Buffer;

        return pdfBuffer;
    } catch (error) {
        console.error("PDF GENERATION FAILED");
        throw error;
    }
}




