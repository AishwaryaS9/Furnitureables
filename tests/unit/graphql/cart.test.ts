// @vitest-environment node
import { auth, clerkClient } from "@clerk/nextjs/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cartResolver } from "@/graphql/resolvers/cart";
import { prisma } from "@/lib/prisma";

const tx = {
    cartItem: { deleteMany: vi.fn(), createMany: vi.fn() },
};

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn(), clerkClient: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
    prisma: {
        user: { findUnique: vi.fn(), upsert: vi.fn() },
        cart: { findUnique: vi.fn(), create: vi.fn() },
        $transaction: vi.fn(),
    },
}));

const { saveCart } = cartResolver.Mutation;
const { cart: cartQuery } = cartResolver.Query;

beforeEach(() => {
    vi.resetAllMocks();

    // saveCart has debug logging; keep the test output clean
    vi.spyOn(console, "log").mockImplementation(() => { });
    vi.spyOn(console, "trace").mockImplementation(() => { });

    vi.mocked(auth).mockResolvedValue({ userId: "clerk_1" } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(prisma.cart.findUnique).mockResolvedValue({ id: "cart-1" } as never);
    vi.mocked(prisma.$transaction).mockImplementation((async (cb: (t: typeof tx) => unknown) => cb(tx)) as never);
});

describe("cart query", () => {
    it("rejects a visitor who is not signed in", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: null } as never);

        await expect(cartQuery()).rejects.toThrow("Unauthorized");
    });

    it("returns the user's cart", async () => {
        const cart = { id: "cart-1", items: [] };
        vi.mocked(prisma.cart.findUnique).mockResolvedValue(cart as never);

        await expect(cartQuery()).resolves.toBe(cart);
        expect(prisma.cart.create).not.toHaveBeenCalled();
    });

    it("creates an empty cart the first time", async () => {
        const created = { id: "cart-new", items: [] };
        vi.mocked(prisma.cart.findUnique).mockResolvedValue(null);
        vi.mocked(prisma.cart.create).mockResolvedValue(created as never);

        await expect(cartQuery()).resolves.toBe(created);
        expect(prisma.cart.create).toHaveBeenCalledWith(
            expect.objectContaining({ data: { userId: "user-1" } })
        );
    });
});

describe("saveCart", () => {
    it("rejects a visitor who is not signed in", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: null } as never);

        await expect(saveCart({}, { items: [] })).rejects.toThrow("Unauthorized");
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("replaces the saved items with the new ones in one transaction", async () => {
        await saveCart({}, {
            items: [
                { productId: "p1", quantity: 2 },
                { productId: "p2", quantity: 1 },
            ],
        });

        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: "cart-1" } });
        expect(tx.cartItem.createMany).toHaveBeenCalledWith({
            data: [
                { cartId: "cart-1", productId: "p1", quantity: 2 },
                { cartId: "cart-1", productId: "p2", quantity: 1 },
            ],
            skipDuplicates: true,
        });
    });

    it("keeps only the last entry when the same product is sent twice", async () => {
        await saveCart({}, {
            items: [
                { productId: "p1", quantity: 1 },
                { productId: "p2", quantity: 4 },
                { productId: "p1", quantity: 3 },
            ],
        });

        const { data } = tx.cartItem.createMany.mock.calls[0][0];

        expect(data).toHaveLength(2);
        expect(data).toContainEqual({ cartId: "cart-1", productId: "p1", quantity: 3 });
        expect(data).toContainEqual({ cartId: "cart-1", productId: "p2", quantity: 4 });
    });

    it("only empties the cart when the list is empty", async () => {
        await saveCart({}, { items: [] });

        expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: "cart-1" } });
        expect(tx.cartItem.createMany).not.toHaveBeenCalled();
    });

    it("creates the cart first when the user does not have one", async () => {
        vi.mocked(prisma.cart.findUnique).mockResolvedValueOnce(null).mockResolvedValue({ id: "cart-new" } as never);
        vi.mocked(prisma.cart.create).mockResolvedValue({ id: "cart-new" } as never);

        await saveCart({}, { items: [{ productId: "p1", quantity: 1 }] });

        expect(prisma.cart.create).toHaveBeenCalledWith({ data: { userId: "user-1" } });
        expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: "cart-new" } });
    });

    it("returns the saved cart with its products", async () => {
        const saved = { id: "cart-1", items: [] };
        vi.mocked(prisma.cart.findUnique).mockResolvedValueOnce({ id: "cart-1" } as never).mockResolvedValueOnce(saved as never);

        await expect(saveCart({}, { items: [] })).resolves.toBe(saved);
    });

    describe("first request from a new user", () => {
        beforeEach(() => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
            vi.mocked(clerkClient).mockResolvedValue({
                users: {
                    getUser: vi.fn().mockResolvedValue({
                        emailAddresses: [{ emailAddress: "asha@example.com" }],
                        firstName: "Asha",
                        lastName: "Rao",
                    }),
                },
            } as never);
            vi.mocked(prisma.user.upsert).mockResolvedValue({ id: "user-new" } as never);
        });

        it("creates the database user from the Clerk profile", async () => {
            await saveCart({}, { items: [] });

            expect(prisma.user.upsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { clerkId: "clerk_1" },
                    create: {
                        clerkId: "clerk_1",
                        email: "asha@example.com",
                        firstName: "Asha",
                        lastName: "Rao",
                    },
                })
            );
        });

        it("uses an empty email when Clerk has none", async () => {
            vi.mocked(clerkClient).mockResolvedValue({
                users: { getUser: vi.fn().mockResolvedValue({ emailAddresses: [], firstName: null, lastName: null }) },
            } as never);

            await saveCart({}, { items: [] });

            expect(prisma.user.upsert).toHaveBeenCalledWith(
                expect.objectContaining({ create: expect.objectContaining({ email: "" }) })
            );
        });
    });
});
