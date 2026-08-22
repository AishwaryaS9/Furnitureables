export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Coupon {
    id: string;
    code: string;
    description?: string | null;
    campaignName?: string | null;
    promotionText?: string | null;
    discountType: DiscountType;
    discountValue: number;
    minimumOrder?: number | null;
    maximumDiscount?: number | null;
    usageLimit?: number | null;
    usedCount: number;
    expiresAt?: string | null;
    isActive: boolean;
    isPromotional: boolean;
    priority: number;
    newUserOnly: boolean;
    createdAt: string;
    updatedAt: string;
}
