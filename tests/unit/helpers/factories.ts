import { DiscountType, type Coupon } from "@/generated/prisma";

export function makeCoupon(overrides: Partial<Coupon> = {}): Coupon {
    return {
        id: "coupon-1",
        code: "SAVE10",
        description: null,
        campaignName: null,
        promotionText: null,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minimumOrder: null,
        maximumDiscount: null,
        usageLimit: null,
        usedCount: 0,
        expiresAt: null,
        isActive: true,
        isPromotional: false,
        priority: 0,
        newUserOnly: false,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
        ...overrides,
    } as Coupon;
}

export function makeCartLine(
    overrides: { id?: string; title?: string; price?: number; quantity?: number; image?: string | null; sku?: string } = {}
) {
    const { id = "p1", title = "Oak Chair", price = 1000, quantity = 1, image = "/a.webp", sku = "SKU-1" } = overrides;

    return {
        id: `line-${id}`,
        quantity,
        product: {
            id,
            title,
            price,
            sku,
            media: image ? [{ url: image }] : [],
        },
    };
}

export const makeAddress = (overrides: Record<string, unknown> = {}) => ({
    id: "addr-1",
    userId: "user-1",
    fullName: "Asha Rao",
    phoneCode: "+91",
    phone: "9876543210",
    addressLine1: "12 MG Road",
    addressLine2: null,
    city: "Udupi",
    state: "Karnataka",
    postalCode: "576101",
    country: "India",
    ...overrides,
});
