import { prisma } from "@/lib/prisma";

export async function validateCoupon(
    code: string,
    subtotal: number
) {
    const coupon = await prisma.coupon.findUnique({
        where: {
            code: code.toUpperCase(),
        },
    });

    if (!coupon) {
        throw new Error("Coupon does not exist.");
    }

    if (!coupon.isActive) {
        throw new Error("Coupon is inactive.");
    }

    if (
        coupon.expiresAt &&
        coupon.expiresAt < new Date()
    ) {
        throw new Error("Coupon has expired.");
    }

    if (
        coupon.minimumOrder &&
        subtotal < coupon.minimumOrder
    ) {
        throw new Error(
            `Minimum order amount is ₹${coupon.minimumOrder}.`
        );
    }

    if (
        coupon.usageLimit &&
        coupon.usedCount >= coupon.usageLimit
    ) {
        throw new Error("Coupon usage limit reached.");
    }

    return coupon;
}