// @vitest-environment node
import { describe, expect, it } from "vitest";
import { DiscountType } from "@/generated/prisma";
import { calculateDiscount } from "@/lib/coupon/calculateDiscount";
import { makeCoupon } from "../../helpers/factories";

const percent = (discountValue: number, extra = {}) =>
    makeCoupon({ discountType: DiscountType.PERCENTAGE, discountValue, ...extra });

const fixed = (discountValue: number, extra = {}) =>
    makeCoupon({ discountType: DiscountType.FIXED, discountValue, ...extra });

describe("calculateDiscount", () => {
    describe("percentage coupons", () => {
        it("takes the percentage of the subtotal", () => {
            expect(calculateDiscount(1000, percent(10))).toBe(100);
            expect(calculateDiscount(2500, percent(20))).toBe(500);
        });

        it("caps the discount at maximumDiscount", () => {
            expect(calculateDiscount(5000, percent(20, { maximumDiscount: 500 }))).toBe(500);
        });

        it("does not touch the discount when it is below maximumDiscount", () => {
            expect(calculateDiscount(1000, percent(10, { maximumDiscount: 500 }))).toBe(100);
        });

        it("applies no cap when maximumDiscount is null or 0", () => {
            expect(calculateDiscount(5000, percent(20, { maximumDiscount: null }))).toBe(1000);
            expect(calculateDiscount(5000, percent(20, { maximumDiscount: 0 }))).toBe(1000);
        });

        it("gives the full subtotal for 100%", () => {
            expect(calculateDiscount(799, percent(100))).toBe(799);
        });

        it("never goes above the subtotal, even for more than 100%", () => {
            expect(calculateDiscount(200, percent(150))).toBe(200);
        });

        it("does not round (callers round when they charge)", () => {
            expect(calculateDiscount(999, percent(10))).toBeCloseTo(99.9);
        });
    });

    describe("fixed coupons", () => {
        it("takes the fixed amount off", () => {
            expect(calculateDiscount(1000, fixed(150))).toBe(150);
        });

        it("never goes above the subtotal", () => {
            expect(calculateDiscount(100, fixed(500))).toBe(100);
        });

        it("ignores maximumDiscount (it only applies to percentages)", () => {
            expect(calculateDiscount(1000, fixed(300, { maximumDiscount: 100 }))).toBe(300);
        });
    });

    it("is 0 for an empty subtotal", () => {
        expect(calculateDiscount(0, percent(10))).toBe(0);
        expect(calculateDiscount(0, fixed(50))).toBe(0);
    });
});
