import { prisma } from "@/lib/prisma";

/**
 * Finds the promotion shown in the navbar bar.
 *
 * Anonymous visitors and new customers see both "new user" and "all customer"
 * promotions; existing customers only see the "all customer" ones.
 */
export async function findActivePromotion(isNewUser: boolean) {
    const promotions = await prisma.coupon.findMany({
        where: {
            isActive: true,
            isPromotional: true,
            promotionText: { not: null },
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            ...(isNewUser ? {} : { newUserOnly: false }),
        },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return (
        promotions.find(
            (coupon) =>
                coupon.usageLimit == null || coupon.usedCount < coupon.usageLimit
        ) ?? null
    );
}

/** Serialisable subset that matches the client `ACTIVE_PROMOTION` query. */
export async function fetchAnonymousPromotion() {
    const promo = await findActivePromotion(true);
    if (!promo) return null;

    return {
        id: promo.id,
        code: promo.code,
        campaignName: promo.campaignName,
        promotionText: promo.promotionText,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        maximumDiscount: promo.maximumDiscount,
        expiresAt: promo.expiresAt ? promo.expiresAt.toISOString() : null,
    };
}
