import { create } from "zustand";

type AppliedCoupon = {
    id: string;
    code: string;
    discount: number;
};

type CouponStore = {
    coupon: AppliedCoupon | null;

    setCoupon: (coupon: AppliedCoupon) => void;

    clearCoupon: () => void;
};

export const useCouponStore =
    create<CouponStore>((set) => ({
        coupon: null,

        setCoupon: (coupon) =>
            set({
                coupon,
            }),

        clearCoupon: () =>
            set({
                coupon: null,
            }),
    }));