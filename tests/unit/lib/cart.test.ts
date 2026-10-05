// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getOrCreateCart, getUserByClerkId, replaceCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

const tx = {
    cartItem: { deleteMany: vi.fn(), createMany: vi.fn() },
};

vi.mock("@/lib/prisma", () => ({
    prisma: {
        user: { findUnique: vi.fn() },
        cart: { findUnique: vi.fn(), create: vi.fn() },
        $transaction: vi.fn(),
    },
}));

beforeEach(() => {
    vi.resetAllMocks();
    // run the transaction callback straight away with our fake transaction client
    vi.mocked(prisma.$transaction).mockImplementation((async (cb: (t: typeof tx) => unknown) => cb(tx)) as never);
});

describe("getUserByClerkId", () => {
    it("looks the user up by Clerk id", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1" } as never);

        await expect(getUserByClerkId("clerk_1")).resolves.toEqual({ id: "u1" });
        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { clerkId: "clerk_1" } });
    });
});

describe("getOrCreateCart", () => {
    it("returns the existing cart without creating a new one", async () => {
        const cart = { id: "c1", items: [] };
        vi.mocked(prisma.cart.findUnique).mockResolvedValue(cart as never);

        await expect(getOrCreateCart("u1")).resolves.toBe(cart);
        expect(prisma.cart.create).not.toHaveBeenCalled();
    });

    it("creates a cart for a user that has none", async () => {
        const created = { id: "c2", items: [] };
        vi.mocked(prisma.cart.findUnique).mockResolvedValue(null);
        vi.mocked(prisma.cart.create).mockResolvedValue(created as never);

        await expect(getOrCreateCart("u1")).resolves.toBe(created);
        expect(prisma.cart.create).toHaveBeenCalledWith(
            expect.objectContaining({ data: { userId: "u1" } })
        );
    });
});

describe("replaceCart", () => {
    it("empties the cart and saves the new items in one transaction", async () => {
        await replaceCart("c1", [
            { id: "p1", quantity: 2 },
            { id: "p2", quantity: 1 },
        ]);

        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: "c1" } });
        expect(tx.cartItem.createMany).toHaveBeenCalledWith({
            data: [
                { cartId: "c1", productId: "p1", quantity: 2 },
                { cartId: "c1", productId: "p2", quantity: 1 },
            ],
        });
    });

    it("deletes first, then creates", async () => {
        const order: string[] = [];
        tx.cartItem.deleteMany.mockImplementation(async () => void order.push("delete"));
        tx.cartItem.createMany.mockImplementation(async () => void order.push("create"));

        await replaceCart("c1", [{ id: "p1", quantity: 1 }]);

        expect(order).toEqual(["delete", "create"]);
    });

    it("only empties the cart when the new list is empty", async () => {
        await replaceCart("c1", []);

        expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: "c1" } });
        expect(tx.cartItem.createMany).not.toHaveBeenCalled();
    });
});
