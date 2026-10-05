// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DiscountType } from "@/generated/prisma";
import { buildOrder } from "@/lib/order/buildOrder";
import { prisma } from "@/lib/prisma";
import { validateCoupon } from "@/lib/coupon/validateCoupon";
import { makeAddress, makeCartLine, makeCoupon } from "../../helpers/factories";

vi.mock("@/lib/prisma", () => ({
    prisma: {
        cart: { findUnique: vi.fn() },
        address: { findFirst: vi.fn() },
        coupon: { findUnique: vi.fn() },
    },
}));

vi.mock("@/lib/coupon/validateCoupon", () => ({ validateCoupon: vi.fn() }));

const findCart = vi.mocked(prisma.cart.findUnique);
const findAddress = vi.mocked(prisma.address.findFirst);
const findCoupon = vi.mocked(prisma.coupon.findUnique);
const validate = vi.mocked(validateCoupon);

const cartWith = (...lines: ReturnType<typeof makeCartLine>[]) =>
    ({ id: "cart-1", items: lines }) as never;

beforeEach(() => {
    vi.resetAllMocks();
    findAddress.mockResolvedValue(makeAddress() as never);
});

describe("buildOrder", () => {
    describe("guards", () => {
        it("rejects when the user has no cart", async () => {
            findCart.mockResolvedValue(null);

            await expect(buildOrder("user-1", "addr-1")).rejects.toThrow("Cart is empty.");
        });

        it("rejects an empty cart", async () => {
            findCart.mockResolvedValue(cartWith());

            await expect(buildOrder("user-1", "addr-1")).rejects.toThrow("Cart is empty.");
        });

        it("rejects an address that is not found", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine()));
            findAddress.mockResolvedValue(null);

            await expect(buildOrder("user-1", "addr-9")).rejects.toThrow("Address not found.");
        });

        it("only accepts an address that belongs to the same user", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine()));

            await buildOrder("user-1", "addr-1");

            expect(findAddress).toHaveBeenCalledWith({ where: { id: "addr-1", userId: "user-1" } });
        });

        it("loads the cart of the given user, with products and media", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine()));

            await buildOrder("user-1", "addr-1");

            expect(findCart).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { userId: "user-1" },
                    include: { items: { include: { product: { include: { media: true } } } } },
                })
            );
        });
    });

    describe("subtotal and shipping", () => {
        it("adds up price x quantity for every line", async () => {
            findCart.mockResolvedValue(
                cartWith(
                    makeCartLine({ id: "a", price: 1000, quantity: 2 }),
                    makeCartLine({ id: "b", price: 250, quantity: 3 })
                )
            );

            const order = await buildOrder("user-1", "addr-1");

            expect(order.subtotal).toBe(2750);
        });

        it("charges 499 shipping below 5000", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine({ price: 4999 })));

            const order = await buildOrder("user-1", "addr-1");

            expect(order.shipping).toBe(499);
            expect(order.total).toBe(4999 + 499);
        });

        it("gives free shipping at exactly 5000", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine({ price: 5000 })));

            const order = await buildOrder("user-1", "addr-1");

            expect(order.shipping).toBe(0);
            expect(order.total).toBe(5000);
        });

        it("gives free shipping above 5000", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine({ price: 2600, quantity: 2 })));

            const order = await buildOrder("user-1", "addr-1");

            expect(order.shipping).toBe(0);
        });

        it("has no tax for now", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine()));

            expect((await buildOrder("user-1", "addr-1")).tax).toBe(0);
        });

        it("returns the cart, the address and an order number", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine()));

            const order = await buildOrder("user-1", "addr-1");

            expect(order.address.id).toBe("addr-1");
            expect(order.cart.id).toBe("cart-1");
            expect(order.orderNumber).toMatch(/^ORD-\d+$/);
        });
    });

    describe("without a coupon", () => {
        it("has no discount and no coupon", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine({ price: 1000 })));

            const order = await buildOrder("user-1", "addr-1");

            expect(order.coupon).toBeNull();
            expect(order.discount).toBe(0);
            expect(order.total).toBe(1000 + 499);
            expect(findCoupon).not.toHaveBeenCalled();
            expect(validate).not.toHaveBeenCalled();
        });
    });

    describe("with a coupon", () => {
        it("rejects a coupon id that does not exist", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine()));
            findCoupon.mockResolvedValue(null);

            await expect(buildOrder("user-1", "addr-1", "missing")).rejects.toThrow("Coupon not found.");
        });

        it("validates the coupon against the real subtotal and the user", async () => {
            const coupon = makeCoupon({ code: "SAVE10" });
            findCart.mockResolvedValue(cartWith(makeCartLine({ price: 1000, quantity: 2 })));
            findCoupon.mockResolvedValue(coupon as never);

            await buildOrder("user-1", "addr-1", "coupon-1");

            expect(findCoupon).toHaveBeenCalledWith({ where: { id: "coupon-1" } });
            expect(validate).toHaveBeenCalledWith("SAVE10", 2000, "user-1");
        });

        it("does not build an order when validation fails", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine()));
            findCoupon.mockResolvedValue(makeCoupon() as never);
            validate.mockRejectedValue(new Error("Coupon has expired."));

            await expect(buildOrder("user-1", "addr-1", "coupon-1")).rejects.toThrow("Coupon has expired.");
        });

        it("subtracts a percentage discount from the total", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine({ price: 1000 })));
            findCoupon.mockResolvedValue(
                makeCoupon({ discountType: DiscountType.PERCENTAGE, discountValue: 10 }) as never
            );

            const order = await buildOrder("user-1", "addr-1", "coupon-1");

            expect(order.discount).toBe(100);
            expect(order.total).toBe(1000 + 499 - 100);
            expect(order.coupon?.id).toBe("coupon-1");
        });

        it("subtracts a fixed discount from the total", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine({ price: 3000 })));
            findCoupon.mockResolvedValue(
                makeCoupon({ discountType: DiscountType.FIXED, discountValue: 250 }) as never
            );

            const order = await buildOrder("user-1", "addr-1", "coupon-1");

            expect(order.total).toBe(3000 + 499 - 250);
        });

        it("decides free shipping from the subtotal before the discount", async () => {
            findCart.mockResolvedValue(cartWith(makeCartLine({ price: 5200 })));
            findCoupon.mockResolvedValue(
                makeCoupon({ discountType: DiscountType.FIXED, discountValue: 1000 }) as never
            );

            const order = await buildOrder("user-1", "addr-1", "coupon-1");

            // 5200 - 1000 would be under 5000, but shipping is still free
            expect(order.shipping).toBe(0);
            expect(order.total).toBe(4200);
        });
    });
});
