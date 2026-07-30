import { Coupon, DiscountType } from "@/generated/prisma";

export function calculateDiscount(
    subtotal: number,
    coupon: Coupon
): number {
    let discount = 0;

    if (coupon.discountType === DiscountType.PERCENTAGE) {
        discount = (subtotal * coupon.discountValue) / 100;

        if (
            coupon.maximumDiscount &&
            discount > coupon.maximumDiscount
        ) {
            discount = coupon.maximumDiscount;
        }
    } else {
        discount = coupon.discountValue;
    }

    return Math.min(discount, subtotal);
}