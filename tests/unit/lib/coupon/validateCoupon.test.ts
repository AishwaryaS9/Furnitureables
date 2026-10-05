// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateCoupon } from "@/lib/coupon/validateCoupon";
import { prisma } from "@/lib/prisma";
import { makeCoupon } from "../../helpers/factories";

vi.mock("@/lib/prisma", () => ({
    prisma: {
        coupon: { findUnique: vi.fn() },
        order: { findFirst: vi.fn() },
    },
}));

const findCoupon = vi.mocked(prisma.coupon.findUnique);
const findOrder = vi.mocked(prisma.order.findFirst);

const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => {
    vi.resetAllMocks();
});

describe("validateCoupon", () => {
    it("looks the coupon up by its upper-cased code", async () => {
        findCoupon.mockResolvedValue(makeCoupon() as never);

        await validateCoupon("save10", 1000);

        expect(findCoupon).toHaveBeenCalledWith({ where: { code: "SAVE10" } });
    });

    it("returns the coupon when every rule passes", async () => {
        const coupon = makeCoupon();
        findCoupon.mockResolvedValue(coupon as never);

        await expect(validateCoupon("SAVE10", 1000)).resolves.toBe(coupon);
    });

    it("rejects a code that does not exist", async () => {
        findCoupon.mockResolvedValue(null);

        await expect(validateCoupon("NOPE", 1000)).rejects.toThrow("Coupon does not exist.");
    });

    it("rejects an inactive coupon", async () => {
        findCoupon.mockResolvedValue(makeCoupon({ isActive: false }) as never);

        await expect(validateCoupon("SAVE10", 1000)).rejects.toThrow("Coupon is inactive.");
    });

    describe("expiry", () => {
        it("rejects an expired coupon", async () => {
            findCoupon.mockResolvedValue(
                makeCoupon({ expiresAt: new Date(Date.now() - DAY) }) as never
            );

            await expect(validateCoupon("SAVE10", 1000)).rejects.toThrow("Coupon has expired.");
        });

        it("accepts a coupon that expires in the future", async () => {
            findCoupon.mockResolvedValue(
                makeCoupon({ expiresAt: new Date(Date.now() + DAY) }) as never
            );

            await expect(validateCoupon("SAVE10", 1000)).resolves.toBeDefined();
        });

        it("accepts a coupon with no expiry", async () => {
            findCoupon.mockResolvedValue(makeCoupon({ expiresAt: null }) as never);

            await expect(validateCoupon("SAVE10", 1000)).resolves.toBeDefined();
        });
    });

    describe("minimum order", () => {
        beforeEach(() => {
            findCoupon.mockResolvedValue(makeCoupon({ minimumOrder: 2000 }) as never);
        });

        it("rejects a subtotal below the minimum and says what the minimum is", async () => {
            await expect(validateCoupon("SAVE10", 1999)).rejects.toThrow(
                "Minimum order amount is ₹2000."
            );
        });

        it("accepts a subtotal exactly at the minimum", async () => {
            await expect(validateCoupon("SAVE10", 2000)).resolves.toBeDefined();
        });
    });

    describe("usage limit", () => {
        it("rejects a coupon that has reached its limit", async () => {
            findCoupon.mockResolvedValue(makeCoupon({ usageLimit: 5, usedCount: 5 }) as never);

            await expect(validateCoupon("SAVE10", 1000)).rejects.toThrow(
                "Coupon usage limit reached."
            );
        });

        it("accepts a coupon that still has uses left", async () => {
            findCoupon.mockResolvedValue(makeCoupon({ usageLimit: 5, usedCount: 4 }) as never);

            await expect(validateCoupon("SAVE10", 1000)).resolves.toBeDefined();
        });

        it("has no limit when usageLimit is null", async () => {
            findCoupon.mockResolvedValue(makeCoupon({ usageLimit: null, usedCount: 9999 }) as never);

            await expect(validateCoupon("SAVE10", 1000)).resolves.toBeDefined();
        });
    });

    describe("new-customer-only coupons", () => {
        beforeEach(() => {
            findCoupon.mockResolvedValue(makeCoupon({ newUserOnly: true }) as never);
        });

        it("accepts a signed-in customer with no previous orders", async () => {
            findOrder.mockResolvedValue(null);

            await expect(validateCoupon("SAVE10", 1000, "user-1")).resolves.toBeDefined();
            expect(findOrder).toHaveBeenCalledWith({
                where: { userId: "user-1" },
                select: { id: true },
            });
        });

        it("rejects a customer who has ordered before", async () => {
            findOrder.mockResolvedValue({ id: "old-order" } as never);

            await expect(validateCoupon("SAVE10", 1000, "user-1")).rejects.toThrow(
                "This coupon is only available to new customers."
            );
        });

        it("asks guests to sign in", async () => {
            await expect(validateCoupon("SAVE10", 1000)).rejects.toThrow(
                "Sign in to use this new customer coupon."
            );
            expect(findOrder).not.toHaveBeenCalled();
        });
    });

    it("does not look at past orders for a normal coupon", async () => {
        findCoupon.mockResolvedValue(makeCoupon({ newUserOnly: false }) as never);

        await validateCoupon("SAVE10", 1000, "user-1");

        expect(findOrder).not.toHaveBeenCalled();
    });
});
