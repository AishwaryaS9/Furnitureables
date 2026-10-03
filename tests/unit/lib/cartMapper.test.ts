import { describe, expect, it } from "vitest";
import { mapServerCartItems } from "@/lib/cartMapper";
import type { ServerCartItem } from "@/types/cart";

const serverItem = (overrides: Partial<ServerCartItem["product"]> = {}, quantity = 1): ServerCartItem => ({
    quantity,
    product: {
        id: "p1",
        title: "Oak Chair",
        price: 120,
        media: [
            { id: "m1", url: "/a.webp", type: "IMAGE", altText: null, sortOrder: 0 },
            { id: "m2", url: "/b.webp", type: "IMAGE", altText: null, sortOrder: 1 },
        ],
        ...overrides,
    },
});

describe("mapServerCartItems", () => {
    it("returns an empty list for an empty cart", () => {
        expect(mapServerCartItems([])).toEqual([]);
    });

    it("flattens a server cart item into a guest cart item", () => {
        expect(mapServerCartItems([serverItem({}, 3)])).toEqual([
            { id: "p1", title: "Oak Chair", price: 120, image: "/a.webp", quantity: 3 },
        ]);
    });

    it("uses the first media entry as the image", () => {
        expect(mapServerCartItems([serverItem()])[0].image).toBe("/a.webp");
    });

    it("leaves image undefined when the product has no media", () => {
        expect(mapServerCartItems([serverItem({ media: [] })])[0].image).toBeUndefined();
    });

    it("keeps the order of items", () => {
        const items = [
            serverItem({ id: "a" }),
            serverItem({ id: "b" }),
            serverItem({ id: "c" }),
        ];

        expect(mapServerCartItems(items).map((i) => i.id)).toEqual(["a", "b", "c"]);
    });
});
