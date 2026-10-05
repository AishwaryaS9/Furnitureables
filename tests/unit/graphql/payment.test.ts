// @vitest-environment node
import crypto from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { paymentResolver } from "@/graphql/resolvers/payment";
import { prisma } from "@/lib/prisma";
import { confirmStripeOrderPayment } from "@/lib/order/confirmStripeOrder";
import { sendOrderConfirmedSideEffects } from "@/lib/order/onOrderConfirmed";
import { getStripe } from "@/lib/stripe";

const tx = {
    product: { updateMany: vi.fn() },
    coupon: { update: vi.fn() },
    cart: { findUnique: vi.fn() },
    cartItem: { deleteMany: vi.fn() },
    order: { update: vi.fn() },
};

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
    prisma: {
        user: { findUnique: vi.fn() },
        order: { findFirst: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
        $transaction: vi.fn(),
    },
}));
vi.mock("@/lib/order/onOrderConfirmed", () => ({ sendOrderConfirmedSideEffects: vi.fn() }));
vi.mock("@/lib/order/confirmStripeOrder", () => ({ confirmStripeOrderPayment: vi.fn() }));
vi.mock("@/lib/stripe", () => ({ getStripe: vi.fn() }));

const SECRET = "test_razorpay_secret";
const sign = (orderId: string, paymentId: string) =>
    crypto.createHmac("sha256", SECRET).update(`${orderId}|${paymentId}`).digest("hex");

const verify = paymentResolver.Mutation.verifyRazorpayPayment;
const confirmStripe = paymentResolver.Mutation.confirmStripePayment;

const pendingOrder = (overrides: Record<string, unknown> = {}) => ({
    id: "order-1",
    userId: "user-1",
    paymentStatus: "PENDING",
    razorpayOrderId: "rzp_order_1",
    couponId: null,
    items: [
        { productId: "p1", quantity: 2, title: "Oak Chair" },
        { productId: "p2", quantity: 1, title: "Side Table" },
    ],
    ...overrides,
});

const verifyArgs = (overrides: Record<string, string> = {}) => ({
    orderId: "order-1",
    razorpayOrderId: "rzp_order_1",
    razorpayPaymentId: "pay_1",
    razorpaySignature: sign("rzp_order_1", "pay_1"),
    ...overrides,
});

beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("RAZORPAY_KEY_SECRET", SECRET);

    vi.mocked(auth).mockResolvedValue({ userId: "clerk_1" } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(prisma.$transaction).mockImplementation((async (cb: (t: typeof tx) => unknown) => cb(tx)) as never);

    tx.product.updateMany.mockResolvedValue({ count: 1 });
    tx.cart.findUnique.mockResolvedValue({ id: "cart-1" });
    tx.order.update.mockResolvedValue({ id: "order-1", status: "CONFIRMED", paymentStatus: "PAID" });
    vi.mocked(sendOrderConfirmedSideEffects).mockResolvedValue(undefined);
});

describe("verifyRazorpayPayment", () => {
    describe("who is asking", () => {
        it("rejects a visitor who is not signed in", async () => {
            vi.mocked(auth).mockResolvedValue({ userId: null } as never);

            await expect(verify({}, verifyArgs())).rejects.toThrow("Unauthorized");
        });

        it("rejects a Clerk user that has no account in the database", async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

            await expect(verify({}, verifyArgs())).rejects.toThrow("User not found");
        });

        it("only finds orders that belong to the signed-in user", async () => {
            vi.mocked(prisma.order.findFirst).mockResolvedValue(null);

            await expect(verify({}, verifyArgs())).rejects.toThrow("Order not found.");
            expect(prisma.order.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: "order-1", userId: "user-1" } })
            );
        });
    });

    describe("checks before touching anything", () => {
        it("returns an already-paid order as it is (safe to call twice)", async () => {
            vi.mocked(prisma.order.findFirst).mockResolvedValue(pendingOrder({ paymentStatus: "PAID" }) as never);
            vi.mocked(prisma.order.findUnique).mockResolvedValue({ id: "order-1" } as never);

            await expect(verify({}, verifyArgs())).resolves.toEqual({ id: "order-1" });
            expect(tx.product.updateMany).not.toHaveBeenCalled();
            expect(sendOrderConfirmedSideEffects).not.toHaveBeenCalled();
        });

        it("rejects a payment made for a different Razorpay order", async () => {
            vi.mocked(prisma.order.findFirst).mockResolvedValue(pendingOrder() as never);

            await expect(
                verify({}, verifyArgs({ razorpayOrderId: "rzp_order_OTHER" }))
            ).rejects.toThrow("Order mismatch.");
            expect(prisma.order.update).not.toHaveBeenCalled();
        });
    });

    describe("signature", () => {
        beforeEach(() => {
            vi.mocked(prisma.order.findFirst).mockResolvedValue(pendingOrder() as never);
        });

        it("marks the order FAILED and rejects when the signature is wrong", async () => {
            await expect(
                verify({}, verifyArgs({ razorpaySignature: "forged" }))
            ).rejects.toThrow("Payment verification failed.");

            expect(prisma.order.update).toHaveBeenCalledWith({
                where: { id: "order-1" },
                data: { paymentStatus: "FAILED" },
            });
        });

        it("does not reduce stock, clear the cart or send emails for a bad signature", async () => {
            await expect(verify({}, verifyArgs({ razorpaySignature: "forged" }))).rejects.toThrow();

            expect(tx.product.updateMany).not.toHaveBeenCalled();
            expect(tx.cartItem.deleteMany).not.toHaveBeenCalled();
            expect(sendOrderConfirmedSideEffects).not.toHaveBeenCalled();
        });

        it("rejects a signature made with a different secret", async () => {
            const wrong = crypto.createHmac("sha256", "someone_elses_secret").update("rzp_order_1|pay_1").digest("hex");

            await expect(verify({}, verifyArgs({ razorpaySignature: wrong }))).rejects.toThrow(
                "Payment verification failed."
            );
        });

        it("rejects a signature made for a different payment id", async () => {
            await expect(
                verify({}, verifyArgs({ razorpaySignature: sign("rzp_order_1", "pay_OTHER") }))
            ).rejects.toThrow("Payment verification failed.");
        });
    });

    describe("a correctly signed payment", () => {
        beforeEach(() => {
            vi.mocked(prisma.order.findFirst).mockResolvedValue(pendingOrder() as never);
        });

        it("reduces stock for every item, never below zero", async () => {
            await verify({}, verifyArgs());

            expect(tx.product.updateMany).toHaveBeenCalledWith({
                where: { id: "p1", stock: { gte: 2 } },
                data: { stock: { decrement: 2 } },
            });
            expect(tx.product.updateMany).toHaveBeenCalledWith({
                where: { id: "p2", stock: { gte: 1 } },
                data: { stock: { decrement: 1 } },
            });
        });

        it("clears the cart", async () => {
            await verify({}, verifyArgs());

            expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: "cart-1" } });
        });

        it("does not fail when the user has no cart row", async () => {
            tx.cart.findUnique.mockResolvedValue(null);

            await expect(verify({}, verifyArgs())).resolves.toBeDefined();
            expect(tx.cartItem.deleteMany).not.toHaveBeenCalled();
        });

        it("marks the order confirmed and paid and stores the payment details", async () => {
            await verify({}, verifyArgs());

            expect(tx.order.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: "order-1" },
                    data: {
                        status: "CONFIRMED",
                        paymentStatus: "PAID",
                        razorpayPaymentId: "pay_1",
                        razorpaySignature: sign("rzp_order_1", "pay_1"),
                    },
                })
            );
        });

        it("counts a coupon use only when the order has a coupon", async () => {
            await verify({}, verifyArgs());
            expect(tx.coupon.update).not.toHaveBeenCalled();

            vi.mocked(prisma.order.findFirst).mockResolvedValue(pendingOrder({ couponId: "coupon-1" }) as never);
            await verify({}, verifyArgs());

            expect(tx.coupon.update).toHaveBeenCalledWith({
                where: { id: "coupon-1" },
                data: { usedCount: { increment: 1 } },
            });
        });

        it("sends the confirmation emails and notifications for the confirmed order", async () => {
            await verify({}, verifyArgs());

            expect(sendOrderConfirmedSideEffects).toHaveBeenCalledWith("order-1");
        });

        it("still succeeds when the confirmation email fails", async () => {
            const logged = vi.spyOn(console, "error").mockImplementation(() => { });
            vi.mocked(sendOrderConfirmedSideEffects).mockRejectedValue(new Error("SMTP down"));

            await expect(verify({}, verifyArgs())).resolves.toMatchObject({ paymentStatus: "PAID" });

            await Promise.resolve();
            expect(logged).toHaveBeenCalled();
        });

        it("fails and does not confirm the order when an item is out of stock", async () => {
            tx.product.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

            await expect(verify({}, verifyArgs())).rejects.toThrow("Side Table is out of stock");

            expect(tx.order.update).not.toHaveBeenCalled();
            expect(tx.cartItem.deleteMany).not.toHaveBeenCalled();
            expect(sendOrderConfirmedSideEffects).not.toHaveBeenCalled();
        });
    });
});

describe("confirmStripePayment", () => {
    const args = { orderId: "order-1", paymentIntentId: "pi_1" };
    const stripeOrder = (overrides: Record<string, unknown> = {}) => ({
        id: "order-1",
        paymentStatus: "PENDING",
        stripePaymentIntentId: "pi_1",
        ...overrides,
    });

    const retrieve = vi.fn();

    beforeEach(() => {
        vi.mocked(getStripe).mockReturnValue({ paymentIntents: { retrieve } } as never);
        retrieve.mockResolvedValue({ status: "succeeded" });
        vi.mocked(prisma.order.findFirst).mockResolvedValue(stripeOrder() as never);
        vi.mocked(prisma.order.findUnique).mockResolvedValue({ id: "order-1", paymentStatus: "PAID" } as never);
        vi.mocked(confirmStripeOrderPayment).mockResolvedValue({ order: { id: "order-1" }, justConfirmed: true } as never);
    });

    it("rejects a visitor who is not signed in", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: null } as never);

        await expect(confirmStripe({}, args)).rejects.toThrow("Unauthorized");
    });

    it("only finds orders that belong to the signed-in user", async () => {
        vi.mocked(prisma.order.findFirst).mockResolvedValue(null);

        await expect(confirmStripe({}, args)).rejects.toThrow("Order not found.");
        expect(prisma.order.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: "order-1", userId: "user-1" } })
        );
    });

    it("returns an already-paid order without asking Stripe", async () => {
        const paid = stripeOrder({ paymentStatus: "PAID" });
        vi.mocked(prisma.order.findFirst).mockResolvedValue(paid as never);

        await expect(confirmStripe({}, args)).resolves.toBe(paid);
        expect(retrieve).not.toHaveBeenCalled();
    });

    it("rejects a payment intent that belongs to a different order", async () => {
        await expect(
            confirmStripe({}, { ...args, paymentIntentId: "pi_OTHER" })
        ).rejects.toThrow("Order mismatch.");
        expect(retrieve).not.toHaveBeenCalled();
    });

    it("asks Stripe for the real status of the payment", async () => {
        await confirmStripe({}, args);

        expect(retrieve).toHaveBeenCalledWith("pi_1");
    });

    it.each(["processing", "requires_payment_method", "canceled"])(
        "leaves the order alone when Stripe says %s",
        async (status) => {
            retrieve.mockResolvedValue({ status });
            const order = stripeOrder();
            vi.mocked(prisma.order.findFirst).mockResolvedValue(order as never);

            await expect(confirmStripe({}, args)).resolves.toBe(order);
            expect(confirmStripeOrderPayment).not.toHaveBeenCalled();
        }
    );

    it("confirms the order when Stripe says it succeeded", async () => {
        const result = await confirmStripe({}, args);

        expect(confirmStripeOrderPayment).toHaveBeenCalledWith("order-1");
        expect(result).toEqual({ id: "order-1", paymentStatus: "PAID" });
    });

    it("sends confirmation emails only the first time the order is confirmed", async () => {
        await confirmStripe({}, args);
        expect(sendOrderConfirmedSideEffects).toHaveBeenCalledWith("order-1");

        vi.mocked(sendOrderConfirmedSideEffects).mockClear();
        vi.mocked(confirmStripeOrderPayment).mockResolvedValue({ order: { id: "order-1" }, justConfirmed: false } as never);

        await confirmStripe({}, args);
        expect(sendOrderConfirmedSideEffects).not.toHaveBeenCalled();
    });

    it("rejects when the order disappears while confirming", async () => {
        vi.mocked(confirmStripeOrderPayment).mockResolvedValue(null);

        await expect(confirmStripe({}, args)).rejects.toThrow("Order not found.");
    });
});
