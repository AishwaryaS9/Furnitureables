import { validateCoupon } from "../../lib/coupon/validateCoupon";
import { calculateDiscount } from "../../lib/coupon/calculateDiscount";

export const couponResolvers = {
    Query: {
        validateCoupon: async (
            _: unknown,
            args: {
                code: string;
                subtotal: number;
            }
        ) => {
            try {
                const coupon = await validateCoupon(
                    args.code,
                    args.subtotal
                );

                const discount = calculateDiscount(
                    args.subtotal,
                    coupon
                );

                return {
                    success: true,
                    message: "Coupon applied successfully.",
                    discount,
                    coupon,
                };
            } catch (error) {
                return {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Invalid coupon.",
                    discount: 0,
                    coupon: null,
                };
            }
        },
    },
};