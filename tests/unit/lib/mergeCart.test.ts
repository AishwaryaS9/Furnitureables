import { describe, expect, it } from "vitest";
import { mergeCart, type CartItem } from "@/lib/mergeCart";

const item = (id: string, quantity: number, extra: Partial<CartItem> = {}): CartItem => ({
    id,
    title: `Item ${id}`,
    price: 100,
    quantity,
    ...extra,
});

describe("mergeCart", () => {
    it("returns an empty cart when both carts are empty", () => {
        expect(mergeCart([], [])).toEqual([]);
    });

    it("returns the guest items when the server cart is empty", () => {
        expect(mergeCart([item("a", 2)], [])).toEqual([item("a", 2)]);
    });

    it("returns the server items when the guest cart is empty", () => {
        expect(mergeCart([], [item("a", 3)])).toEqual([item("a", 3)]);
    });

    it("keeps items that exist in only one of the carts", () => {
        const merged = mergeCart([item("a", 1)], [item("b", 2)]);

        expect(merged).toHaveLength(2);
        expect(merged.map((i) => i.id).sort()).toEqual(["a", "b"]);
    });

    it("adds quantities when the same product is in both carts", () => {
        const merged = mergeCart([item("a", 2)], [item("a", 3)]);

        expect(merged).toHaveLength(1);
        expect(merged[0].quantity).toBe(5);
    });

    it("keeps the server's product details when the item is in both carts", () => {
        const merged = mergeCart(
            [item("a", 1, { title: "Guest title", price: 50 })],
            [item("a", 1, { title: "Server title", price: 80 })]
        );

        expect(merged[0]).toMatchObject({ title: "Server title", price: 80, quantity: 2 });
    });

    it("does not mutate its inputs", () => {
        const local = [item("a", 2), item("c", 1)];
        const remote = [item("a", 3), item("b", 1)];

        const localBefore = structuredClone(local);
        const remoteBefore = structuredClone(remote);

        const merged = mergeCart(local, remote);
        merged[0].quantity = 999;

        expect(local).toEqual(localBefore);
        expect(remote).toEqual(remoteBefore);
    });

    it("is stable when run twice with the same inputs", () => {
        const local = [item("a", 2)];
        const remote = [item("a", 3)];

        expect(mergeCart(local, remote)).toEqual(mergeCart(local, remote));
    });
});
