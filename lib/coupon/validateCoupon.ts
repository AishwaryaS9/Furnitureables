import { prisma } from "@/lib/prisma";

export async function validateCoupon(
    code: string,
    subtotal: number,
    userId?: string
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

    if (coupon.newUserOnly && userId) {
        const previousOrder = await prisma.order.findFirst({
            where: { userId },
            select: { id: true },
        });
        if (previousOrder) {
            throw new Error("This coupon is only available to new customers.");
        }
    }

    if (coupon.newUserOnly && !userId) {
        throw new Error("Sign in to use this new customer coupon.");
    }
    return coupon;
}