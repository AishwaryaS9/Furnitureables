import { beforeEach, describe, expect, it } from "vitest";
import { useCouponStore } from "@/store/coupon";

beforeEach(() => {
    useCouponStore.setState({ coupon: null });
});

describe("coupon store", () => {
    it("starts with no coupon", () => {
        expect(useCouponStore.getState().coupon).toBeNull();
    });

    it("stores the applied coupon", () => {
        useCouponStore.getState().setCoupon({ id: "c1", code: "SAVE10", discount: 100 });

        expect(useCouponStore.getState().coupon).toEqual({ id: "c1", code: "SAVE10", discount: 100 });
    });

    it("replaces the coupon when another is applied", () => {
        const { setCoupon } = useCouponStore.getState();

        setCoupon({ id: "c1", code: "A", discount: 10 });
        setCoupon({ id: "c2", code: "B", discount: 20 });

        expect(useCouponStore.getState().coupon?.code).toBe("B");
    });

    it("clears the coupon", () => {
        useCouponStore.getState().setCoupon({ id: "c1", code: "A", discount: 10 });

        useCouponStore.getState().clearCoupon();

        expect(useCouponStore.getState().coupon).toBeNull();
    });
});
