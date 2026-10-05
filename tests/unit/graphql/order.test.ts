// @vitest-environment node
import { auth } from "@clerk/nextjs/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { orderResolver } from "@/graphql/resolvers/order";
import { prisma } from "@/lib/prisma";
import { buildOrder } from "@/lib/order/buildOrder";
import { razorpay } from "@/lib/razorpay";
import { sendOrderConfirmedSideEffects } from "@/lib/order/onOrderConfirmed";
import { makeAddress, makeCartLine, makeCoupon } from "../helpers/factories";

const tx = {
    order: { create: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
    orderItem: { createMany: vi.fn(), findMany: vi.fn() },
    product: { updateMany: vi.fn(), update: vi.fn() },
    coupon: { update: vi.fn() },
    cartItem: { deleteMany: vi.fn() },
};

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
    prisma: {
        user: { findUnique: vi.fn() },
        order: { findUnique: vi.fn(), update: vi.fn(), findUniqueOrThrow: vi.fn() },
        $transaction: vi.fn(),
    },
}));
vi.mock("@/lib/order/buildOrder", () => ({ buildOrder: vi.fn() }));
vi.mock("@/lib/razorpay", () => ({ razorpay: { orders: { create: vi.fn() } } }));
vi.mock("@/lib/stripe", () => ({ getStripe: vi.fn() }));
vi.mock("@/lib/order/onOrderConfirmed", () => ({ sendOrderConfirmedSideEffects: vi.fn() }));

const { placeOrder, cancelOrder, createRazorpayOrder, adminUpdateOrderStatus } = orderResolver.Mutation;

const built = (overrides: Record<string, unknown> = {}) => ({
    cart: {
        id: "cart-1",
        items: [
            makeCartLine({ id: "p1", title: "Oak Chair", price: 1000, quantity: 2, image: "/chair.webp", sku: "CH-1" }),
            makeCartLine({ id: "p2", title: "Side Table", price: 500, quantity: 1, image: null, sku: "TB-1" }),
        ],
    },
    address: makeAddress(),
    subtotal: 2500,
    shipping: 499,
    tax: 0,
    discount: 0,
    total: 2999,
    orderNumber: "ORD-123",
    coupon: null,
    ...overrides,
});

beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(auth).mockResolvedValue({ userId: "clerk_1" } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(prisma.$transaction).mockImplementation((async (cb: (t: typeof tx) => unknown) => cb(tx)) as never);
    vi.mocked(buildOrder).mockResolvedValue(built() as never);
    vi.mocked(sendOrderConfirmedSideEffects).mockResolvedValue(undefined);

    tx.order.create.mockResolvedValue({ id: "order-1" });
    tx.product.updateMany.mockResolvedValue({ count: 1 });
});

describe("placeOrder", () => {
    const input = { addressId: "addr-1", paymentMethod: "COD" as const };

    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => { });
    });

    it("rejects a visitor who is not signed in", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: null } as never);

        await expect(placeOrder({}, { input })).rejects.toThrow("Unauthorized");
        expect(buildOrder).not.toHaveBeenCalled();
    });

    it("builds the order for this user, address and coupon", async () => {
        await placeOrder({}, { input: { ...input, couponId: "coupon-1" } });

        expect(buildOrder).toHaveBeenCalledWith("user-1", "addr-1", "coupon-1");
    });

    describe("cash on delivery", () => {
        it("creates a confirmed order with payment still pending", async () => {
            await placeOrder({}, { input });

            expect(tx.order.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    orderNumber: "ORD-123",
                    userId: "user-1",
                    subtotal: 2500,
                    shipping: 499,
                    discount: 0,
                    total: 2999,
                    currency: "INR",
                    paymentMethod: "COD",
                    status: "CONFIRMED",
                    paymentStatus: "PENDING",
                }),
            });
        });

        it("copies the delivery address onto the order", async () => {
            await placeOrder({}, { input });

            expect(tx.order.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    addressId: "addr-1",
                    fullName: "Asha Rao",
                    phone: "9876543210",
                    addressLine1: "12 MG Road",
                    city: "Udupi",
                    postalCode: "576101",
                    country: "India",
                }),
            });
        });

        it("saves a copy of each cart line (name, price, image, sku) on the order", async () => {
            await placeOrder({}, { input });

            expect(tx.orderItem.createMany).toHaveBeenCalledWith({
                data: [
                    { orderId: "order-1", productId: "p1", title: "Oak Chair", image: "/chair.webp", sku: "CH-1", price: 1000, quantity: 2 },
                    { orderId: "order-1", productId: "p2", title: "Side Table", image: undefined, sku: "TB-1", price: 500, quantity: 1 },
                ],
            });
        });

        it("reduces stock for each item, never below zero", async () => {
            await placeOrder({}, { input });

            expect(tx.product.updateMany).toHaveBeenCalledWith({
                where: { id: "p1", stock: { gte: 2 } },
                data: { stock: { decrement: 2 } },
            });
            expect(tx.product.updateMany).toHaveBeenCalledWith({
                where: { id: "p2", stock: { gte: 1 } },
                data: { stock: { decrement: 1 } },
            });
        });

        it("empties the cart", async () => {
            await placeOrder({}, { input });

            expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: "cart-1" } });
        });

        it("returns the new order and sends the confirmation", async () => {
            await expect(placeOrder({}, { input })).resolves.toEqual({ id: "order-1" });

            expect(sendOrderConfirmedSideEffects).toHaveBeenCalledWith("order-1");
        });
    });

    describe("coupons", () => {
        it("does not touch coupons when none is used", async () => {
            await placeOrder({}, { input });

            expect(tx.coupon.update).not.toHaveBeenCalled();
            expect(tx.order.create).toHaveBeenCalledWith({ data: expect.objectContaining({ couponId: undefined }) });
        });

        it("links the coupon to the order and counts exactly one use", async () => {
            vi.mocked(buildOrder).mockResolvedValue(built({ coupon: makeCoupon({ id: "coupon-1" }), discount: 250, total: 2749 }) as never);

            await placeOrder({}, { input: { ...input, couponId: "coupon-1" } });

            expect(tx.order.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ couponId: "coupon-1", discount: 250, total: 2749 }),
            });
            expect(tx.coupon.update).toHaveBeenCalledTimes(1);
            expect(tx.coupon.update).toHaveBeenCalledWith({
                where: { id: "coupon-1" },
                data: { usedCount: { increment: 1 } },
            });
        });
    });

    describe("failures", () => {
        it("fails with the product name when an item is out of stock", async () => {
            tx.product.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

            await expect(placeOrder({}, { input })).rejects.toThrow("Side Table is out of stock");
        });

        it("does not empty the cart or send emails when an item is out of stock", async () => {
            tx.product.updateMany.mockResolvedValue({ count: 0 });

            await expect(placeOrder({}, { input })).rejects.toThrow();

            expect(tx.cartItem.deleteMany).not.toHaveBeenCalled();
            expect(sendOrderConfirmedSideEffects).not.toHaveBeenCalled();
        });

        it("passes on errors from building the order (empty cart, bad coupon...)", async () => {
            vi.mocked(buildOrder).mockRejectedValue(new Error("Cart is empty."));

            await expect(placeOrder({}, { input })).rejects.toThrow("Cart is empty.");
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it("still returns the order when the confirmation email fails", async () => {
            vi.mocked(sendOrderConfirmedSideEffects).mockRejectedValue(new Error("SMTP down"));

            await expect(placeOrder({}, { input })).resolves.toEqual({ id: "order-1" });
        });
    });

    it.fails("rejects payment methods that were not actually paid for", async () => {
        await expect(
            placeOrder({}, { input: { addressId: "addr-1", paymentMethod: "STRIPE" } })
        ).rejects.toThrow();
    });
});

describe("createRazorpayOrder", () => {
    const input = { addressId: "addr-1", paymentMethod: "RAZORPAY" as const, couponId: "coupon-1" };

    beforeEach(() => {
        vi.mocked(razorpay.orders.create).mockResolvedValue({ id: "rzp_order_1" } as never);
        vi.mocked(buildOrder).mockResolvedValue(built({ coupon: makeCoupon({ id: "coupon-1" }), discount: 250, total: 2749 }) as never);
    });

    it("asks Razorpay for the order total in paise", async () => {
        await createRazorpayOrder({}, { input });

        expect(razorpay.orders.create).toHaveBeenCalledWith({
            amount: 274900,
            currency: "INR",
            receipt: "ORD-123",
        });
    });

    it("rounds a fractional total to whole paise", async () => {
        vi.mocked(buildOrder).mockResolvedValue(built({ total: 1099.9 }) as never);

        await createRazorpayOrder({}, { input });

        expect(razorpay.orders.create).toHaveBeenCalledWith(expect.objectContaining({ amount: 109990 }));
    });

    it("saves a pending order that is waiting for payment", async () => {
        await createRazorpayOrder({}, { input });

        expect(tx.order.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                paymentMethod: "RAZORPAY",
                status: "PENDING",
                paymentStatus: "PENDING",
                razorpayOrderId: "rzp_order_1",
                couponId: "coupon-1",
                total: 2749,
            }),
        });
        expect(tx.orderItem.createMany).toHaveBeenCalledTimes(1);
    });

    it("does not reduce stock, use the coupon or empty the cart until the payment is verified", async () => {
        await createRazorpayOrder({}, { input });

        expect(tx.product.updateMany).not.toHaveBeenCalled();
        expect(tx.coupon.update).not.toHaveBeenCalled();
        expect(tx.cartItem.deleteMany).not.toHaveBeenCalled();
        expect(sendOrderConfirmedSideEffects).not.toHaveBeenCalled();
    });

    it("returns what the checkout page needs to open Razorpay", async () => {
        await expect(createRazorpayOrder({}, { input })).resolves.toEqual({
            orderId: "order-1",
            razorpayOrderId: "rzp_order_1",
            amount: 2749,
            currency: "INR",
        });
    });

    it("does not call Razorpay when the order cannot be built", async () => {
        vi.mocked(buildOrder).mockRejectedValue(new Error("Cart is empty."));

        await expect(createRazorpayOrder({}, { input })).rejects.toThrow("Cart is empty.");
        expect(razorpay.orders.create).not.toHaveBeenCalled();
    });

    it("rejects a visitor who is not signed in", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: null } as never);

        await expect(createRazorpayOrder({}, { input })).rejects.toThrow("Unauthorized");
    });
});

describe("cancelOrder", () => {
    const order = (overrides: Record<string, unknown> = {}) => ({
        id: "order-1",
        status: "CONFIRMED",
        paymentStatus: "PENDING",
        items: [
            { productId: "p1", quantity: 2 },
            { productId: "p2", quantity: 1 },
        ],
        ...overrides,
    });

    beforeEach(() => {
        tx.order.findFirst.mockResolvedValue(order());
        tx.order.update.mockImplementation(async ({ data }) => ({ id: "order-1", ...data }));
    });

    it("rejects a visitor who is not signed in", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: null } as never);

        await expect(cancelOrder({}, { id: "order-1" })).rejects.toThrow("Unauthorized");
    });

    it("only finds orders that belong to the signed-in user", async () => {
        tx.order.findFirst.mockResolvedValue(null);

        await expect(cancelOrder({}, { id: "order-1" })).rejects.toThrow("Order not found.");
        expect(tx.order.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: "order-1", userId: "user-1" } })
        );
    });

    it.each(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"])(
        "does not cancel an order that is %s",
        async (status) => {
            tx.order.findFirst.mockResolvedValue(order({ status }));

            await expect(cancelOrder({}, { id: "order-1" })).rejects.toThrow(
                "Only confirmed orders can be cancelled."
            );
            expect(tx.product.update).not.toHaveBeenCalled();
            expect(tx.order.update).not.toHaveBeenCalled();
        }
    );

    it("puts the stock of every item back", async () => {
        await cancelOrder({}, { id: "order-1" });

        expect(tx.product.update).toHaveBeenCalledWith({
            where: { id: "p1" },
            data: { stock: { increment: 2 } },
        });
        expect(tx.product.update).toHaveBeenCalledWith({
            where: { id: "p2" },
            data: { stock: { increment: 1 } },
        });
    });

    it("cancels an unpaid (cash on delivery) order without changing its payment status", async () => {
        const result = await cancelOrder({}, { id: "order-1" });

        expect(tx.order.update).toHaveBeenCalledWith({
            where: { id: "order-1" },
            data: { status: "CANCELLED" },
        });
        expect(result).toMatchObject({ status: "CANCELLED" });
    });

    it("marks a paid order as refunded when it is cancelled", async () => {
        tx.order.findFirst.mockResolvedValue(order({ paymentStatus: "PAID" }));

        await cancelOrder({}, { id: "order-1" });

        expect(tx.order.update).toHaveBeenCalledWith({
            where: { id: "order-1" },
            data: { status: "CANCELLED", paymentStatus: "REFUNDED" },
        });
    });
});

describe("adminUpdateOrderStatus", () => {
    const existing = (overrides: Record<string, unknown> = {}) => ({
        id: "order-1",
        status: "CONFIRMED",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        ...overrides,
    });

    const loaded = {
        id: "order-1",
        orderNumber: "ORD-123",
        fullName: "Asha Rao",
        user: { email: "asha@example.com" },
        total: 2999,
        currency: "INR",
        status: "SHIPPED",
        paymentStatus: "PENDING",
        paymentMethod: "COD",
        createdAt: new Date("2026-03-01T10:00:00Z"),
        items: [{ id: "i1", title: "Oak Chair", image: "/a.webp", price: 1000, quantity: 2 }],
    };

    beforeEach(() => {
        vi.mocked(prisma.order.findUnique).mockResolvedValue(existing() as never);
        vi.mocked(prisma.order.findUniqueOrThrow).mockResolvedValue(loaded as never);
        tx.orderItem.findMany.mockResolvedValue([
            { productId: "p1", quantity: 2 },
            { productId: "p2", quantity: 1 },
        ]);
    });

    it("rejects a status that does not exist", async () => {
        await expect(
            adminUpdateOrderStatus({}, { id: "order-1", status: "LOST" as never })
        ).rejects.toThrow("Invalid order status.");
        expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it("rejects an order that does not exist", async () => {
        vi.mocked(prisma.order.findUnique).mockResolvedValue(null);

        await expect(
            adminUpdateOrderStatus({}, { id: "nope", status: "SHIPPED" })
        ).rejects.toThrow("Order not found.");
    });

    it("updates only the status for a normal change", async () => {
        await adminUpdateOrderStatus({}, { id: "order-1", status: "SHIPPED" });

        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: "order-1" },
            data: { status: "SHIPPED" },
        });
    });

    it("marks a cash-on-delivery order as paid when it is delivered", async () => {
        await adminUpdateOrderStatus({}, { id: "order-1", status: "DELIVERED" });

        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: "order-1" },
            data: { status: "DELIVERED", paymentStatus: "PAID" },
        });
    });

    it("does not change the payment of an online order when it is delivered", async () => {
        vi.mocked(prisma.order.findUnique).mockResolvedValue(
            existing({ paymentMethod: "STRIPE", paymentStatus: "PAID" }) as never
        );

        await adminUpdateOrderStatus({}, { id: "order-1", status: "DELIVERED" });

        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: "order-1" },
            data: { status: "DELIVERED" },
        });
    });

    describe("cancelling", () => {
        it("puts the stock back and flags a paid order as refunded, in one transaction", async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                existing({ paymentMethod: "STRIPE", paymentStatus: "PAID" }) as never
            );

            await adminUpdateOrderStatus({}, { id: "order-1", status: "CANCELLED" });

            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(tx.product.update).toHaveBeenCalledWith({
                where: { id: "p1" },
                data: { stock: { increment: 2 } },
            });
            expect(tx.product.update).toHaveBeenCalledWith({
                where: { id: "p2" },
                data: { stock: { increment: 1 } },
            });
            expect(tx.order.update).toHaveBeenCalledWith({
                where: { id: "order-1" },
                data: { status: "CANCELLED", paymentStatus: "REFUNDED" },
            });
        });

        it("does not put the stock back twice for an order that is already cancelled", async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(existing({ status: "CANCELLED" }) as never);

            await adminUpdateOrderStatus({}, { id: "order-1", status: "CANCELLED" });

            expect(prisma.$transaction).not.toHaveBeenCalled();
            expect(tx.product.update).not.toHaveBeenCalled();
        });
    });

    it("returns the updated order in the shape the admin table expects", async () => {
        await expect(adminUpdateOrderStatus({}, { id: "order-1", status: "SHIPPED" })).resolves.toEqual({
            id: "order-1",
            orderNumber: "ORD-123",
            customerName: "Asha Rao",
            customerEmail: "asha@example.com",
            itemsCount: 1,
            total: 2999,
            currency: "INR",
            status: "SHIPPED",
            paymentStatus: "PENDING",
            paymentMethod: "COD",
            createdAt: "2026-03-01T10:00:00.000Z",
            items: [{ id: "i1", productName: "Oak Chair", productImage: "/a.webp", quantity: 2, price: 1000 }],
        });
    });

    it("shows a dash when the customer has no email", async () => {
        vi.mocked(prisma.order.findUniqueOrThrow).mockResolvedValue({ ...loaded, user: null } as never);

        const result = await adminUpdateOrderStatus({}, { id: "order-1", status: "SHIPPED" });

        expect(result.customerEmail).toBe("-");
    });
});
