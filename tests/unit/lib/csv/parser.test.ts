// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseProductsCSV } from "@/lib/csv/parser";

const row = (overrides: Record<string, string> = {}): Record<string, string> => ({
    title: "Oak Chair",
    description: "A sturdy chair",
    price: "1200",
    stock: "5",
    sku: "OAK-1",
    type: "chair",
    material: "Oak",
    color: "Natural",
    room: "Dining",
    dimensions: "40x40x90",
    ...overrides,
});

describe("parseProductsCSV", () => {
    it("returns an empty list for no rows", () => {
        expect(parseProductsCSV([])).toEqual([]);
    });

    it("maps a row to a product, turning price and stock into numbers", () => {
        const [product] = parseProductsCSV([row()]);

        expect(product).toMatchObject({
            title: "Oak Chair",
            description: "A sturdy chair",
            price: 1200,
            stock: 5,
            sku: "OAK-1",
            type: "chair",
            material: "Oak",
            color: "Natural",
            room: "Dining",
            dimensions: "40x40x90",
        });
    });

    it("defaults a missing description to an empty string", () => {
        const [product] = parseProductsCSV([row({ description: "" })]);

        expect(product.description).toBe("");
    });

    it("keeps one product per row, in order", () => {
        const products = parseProductsCSV([row({ sku: "A" }), row({ sku: "B" }), row({ sku: "C" })]);

        expect(products.map((p) => p.sku)).toEqual(["A", "B", "C"]);
    });

    it("gives NaN for a price or stock that is not a number (the validator must catch it)", () => {
        const [product] = parseProductsCSV([row({ price: "abc", stock: "" })]);

        expect(product.price).toBeNaN();
        // Number("") is 0, so a blank stock silently becomes 0
        expect(product.stock).toBe(0);
    });

    describe("images", () => {
        it("has no media when there are no images", () => {
            expect(parseProductsCSV([row()])[0].media).toEqual([]);
        });

        it("reads a single image", () => {
            const [product] = parseProductsCSV([row({ image: "https://x.test/a.jpg" })]);

            expect(product.media).toEqual([{ url: "https://x.test/a.jpg", type: "IMAGE", sortOrder: 0 }]);
        });

        it("splits several images on |", () => {
            const [product] = parseProductsCSV([row({ images: "https://x.test/a.jpg | https://x.test/b.jpg" })]);

            expect(product.media).toEqual([
                { url: "https://x.test/a.jpg", type: "IMAGE", sortOrder: 0 },
                { url: "https://x.test/b.jpg", type: "IMAGE", sortOrder: 1 },
            ]);
        });

        it("splits on commas when there is no |", () => {
            const [product] = parseProductsCSV([row({ images: "a.jpg,b.jpg,c.jpg" })]);

            expect(product.media?.map((m) => m.url)).toEqual(["a.jpg", "b.jpg", "c.jpg"]);
        });

        it("keeps commas inside a URL when | is used as the separator", () => {
            const [product] = parseProductsCSV([row({ images: "https://x.test/a,1.jpg|https://x.test/b.jpg" })]);

            expect(product.media?.map((m) => m.url)).toEqual(["https://x.test/a,1.jpg", "https://x.test/b.jpg"]);
        });

        it("trims whitespace and drops empty entries", () => {
            const [product] = parseProductsCSV([row({ images: " a.jpg ,, b.jpg ," })]);

            expect(product.media?.map((m) => m.url)).toEqual(["a.jpg", "b.jpg"]);
        });

        it("prefers the image column over the images column", () => {
            const [product] = parseProductsCSV([row({ image: "one.jpg", images: "two.jpg" })]);

            expect(product.media?.map((m) => m.url)).toEqual(["one.jpg"]);
        });

        it("marks every image as an IMAGE, numbered from 0", () => {
            const [product] = parseProductsCSV([row({ images: "a.jpg|b.jpg|c.jpg" })]);

            expect(product.media?.every((m) => m.type === "IMAGE")).toBe(true);
            expect(product.media?.map((m) => m.sortOrder)).toEqual([0, 1, 2]);
        });
    });
});
