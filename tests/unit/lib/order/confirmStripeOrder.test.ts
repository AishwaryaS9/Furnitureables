// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { confirmStripeOrderPayment } from "@/lib/order/confirmStripeOrder";
import { prisma } from "@/lib/prisma";

const tx = {
    order: { findUnique: vi.fn(), update: vi.fn() },
    product: { updateMany: vi.fn() },
    coupon: { update: vi.fn() },
    cartItem: { deleteMany: vi.fn() },
};

vi.mock("@/lib/prisma", () => ({ prisma: { $transaction: vi.fn() } }));

const pendingOrder = (overrides: Record<string, unknown> = {}) => ({
    id: "order-1",
    userId: "user-1",
    paymentStatus: "PENDING",
    couponId: null,
    items: [
        { productId: "p1", quantity: 2, title: "Oak Chair" },
        { productId: "p2", quantity: 1, title: "Side Table" },
    ],
    ...overrides,
});

beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(prisma.$transaction).mockImplementation((async (cb: (t: typeof tx) => unknown) => cb(tx)) as never);
    tx.product.updateMany.mockResolvedValue({ count: 1 });
    tx.order.update.mockResolvedValue({ id: "order-1", paymentStatus: "PAID", status: "CONFIRMED" });
});

describe("confirmStripeOrderPayment", () => {
    it("returns null when the order does not exist", async () => {
        tx.order.findUnique.mockResolvedValue(null);

        await expect(confirmStripeOrderPayment("missing")).resolves.toBeNull();
        expect(tx.order.update).not.toHaveBeenCalled();
    });

    it("does nothing for an order that is already paid (safe to call twice)", async () => {
        const order = pendingOrder({ paymentStatus: "PAID" });
        tx.order.findUnique.mockResolvedValue(order);

        const result = await confirmStripeOrderPayment("order-1");

        expect(result).toEqual({ order, justConfirmed: false });
        expect(tx.product.updateMany).not.toHaveBeenCalled();
        expect(tx.order.update).not.toHaveBeenCalled();
        expect(tx.cartItem.deleteMany).not.toHaveBeenCalled();
    });

    describe("confirming a pending order", () => {
        beforeEach(() => {
            tx.order.findUnique.mockResolvedValue(pendingOrder());
        });

        it("reduces stock for every item, never below zero", async () => {
            await confirmStripeOrderPayment("order-1");

            expect(tx.product.updateMany).toHaveBeenCalledTimes(2);
            expect(tx.product.updateMany).toHaveBeenCalledWith({
                where: { id: "p1", stock: { gte: 2 } },
                data: { stock: { decrement: 2 } },
            });
            expect(tx.product.updateMany).toHaveBeenCalledWith({
                where: { id: "p2", stock: { gte: 1 } },
                data: { stock: { decrement: 1 } },
            });
        });

        it("marks the order paid and confirmed", async () => {
            await confirmStripeOrderPayment("order-1");

            expect(tx.order.update).toHaveBeenCalledWith({
                where: { id: "order-1" },
                data: { paymentStatus: "PAID", status: "CONFIRMED" },
            });
        });

        it("clears the cart of the customer who placed the order", async () => {
            await confirmStripeOrderPayment("order-1");

            expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cart: { userId: "user-1" } } });
        });

        it("reports that it just confirmed the order", async () => {
            const result = await confirmStripeOrderPayment("order-1");

            expect(result?.justConfirmed).toBe(true);
            expect(result?.order.paymentStatus).toBe("PAID");
        });

        it("does not touch coupons when the order has none", async () => {
            await confirmStripeOrderPayment("order-1");

            expect(tx.coupon.update).not.toHaveBeenCalled();
        });

        it("counts one use of the coupon when the order has one", async () => {
            tx.order.findUnique.mockResolvedValue(pendingOrder({ couponId: "coupon-1" }));

            await confirmStripeOrderPayment("order-1");

            expect(tx.coupon.update).toHaveBeenCalledWith({
                where: { id: "coupon-1" },
                data: { usedCount: { increment: 1 } },
            });
        });
    });

    describe("when an item is out of stock", () => {
        beforeEach(() => {
            tx.order.findUnique.mockResolvedValue(pendingOrder({ couponId: "coupon-1" }));
            tx.product.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });
        });

        it("fails with the product name", async () => {
            await expect(confirmStripeOrderPayment("order-1")).rejects.toThrow("Side Table is out of stock");
        });

        it("does not mark the order paid, use the coupon or clear the cart", async () => {
            await expect(confirmStripeOrderPayment("order-1")).rejects.toThrow();

            expect(tx.order.update).not.toHaveBeenCalled();
            expect(tx.coupon.update).not.toHaveBeenCalled();
            expect(tx.cartItem.deleteMany).not.toHaveBeenCalled();
        });
    });
});
