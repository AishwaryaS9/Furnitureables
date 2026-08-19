export interface ProductGenerationContext {
    type?: string;
    material?: string;
    color?: string;
    room?: string;
    dimensions?: string;
}

export function buildProductDetailsPrompt(
    context: ProductGenerationContext = {}
): string {
    const hints = Object.entries(context)
        .filter(([, value]) => !!value && String(value).trim().length > 0)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n");

    return `You are an e-commerce copywriter for "Furnitureables", an online furniture store.

Look carefully at the attached product photo and generate accurate, sellable listing content for it.

${hints ? `The seller has already provided these details — treat them as ground truth and stay consistent with them:\n${hints}\n` : ""}
Requirements:
- "title": short, specific, and human-friendly (avoid generic words like "Product" or "Item", avoid ALL CAPS, no quotation marks).
- "description": 2-4 sentences a shopper would actually read, focused on the material, design style, and where/how it would be used. No emojis, no exaggerated superlatives, no markdown.
- "skuBase": a short retail-style SKU fragment such as "SOF-VEL-GRN" or "CHR-OAK-BRN" — 3-letter category code, then a 3-letter material/color code, joined with hyphens, all uppercase. This does not need to be globally unique on its own; a unique suffix will be appended separately.
- "type", "material", "color": your best single-word (or short phrase) guess for each, based only on what's visible in the image.
- "dimensions": a plausible estimated size formatted exactly like "45cm x 50cm x 90cm" (width x depth x height), based on typical proportions for this kind of furniture and any visual scale cues (e.g. relative to a room, floor, or nearby objects). Clearly an estimate — reasonable and in-range for the category, not a wild guess.

Only describe what is visibly true in the image — do not invent features you cannot see (e.g. don't claim "stain-resistant fabric" unless it's evident).`;
}
