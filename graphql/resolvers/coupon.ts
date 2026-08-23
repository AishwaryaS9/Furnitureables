import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getAdminUser } from "@/lib/auth/admin";
import { validateCoupon } from "../../lib/coupon/validateCoupon";
import { calculateDiscount } from "../../lib/coupon/calculateDiscount";

async function assertAdmin() {
    const admin = await getAdminUser();
    if (!admin) throw new Error("Forbidden");
    return admin;
}

function normalizeCode(code: string) {
    return code.trim().toUpperCase();
}

export const couponResolvers = {
    Query: {
        validateCoupon: async (_: unknown, args: { code: string; subtotal: number }) => {
            try {
                const { userId: clerkUserId } = await auth();
                const currentUser = clerkUserId
                    ? await prisma.user.findUnique({ where: { clerkId: clerkUserId }, select: { id: true } })
                    : null;
                const coupon = await validateCoupon(args.code, args.subtotal, currentUser?.id);
                const discount = calculateDiscount(args.subtotal, coupon);
                return {
                    success: true,
                    message: "Coupon applied successfully.",
                    discount,
                    coupon,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Invalid coupon.",
                    discount: 0,
                    coupon: null,
                };
            }
        },

        adminCoupons: async () => {
            await assertAdmin();
            return prisma.coupon.findMany({ orderBy: [{ isActive: "desc" }, { createdAt: "desc" }] });
        },

        //original code
        // activePromotion: async () => {
        //     const promotions = await prisma.coupon.findMany({
        //         where: {
        //             isActive: true,
        //             isPromotional: true,
        //             newUserOnly: false,
        //             promotionText: { not: null },
        //             OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        //         },
        //         orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        //     });
        //     return promotions.find((coupon) => coupon.usageLimit == null || coupon.usedCount < coupon.usageLimit) ?? null;
        // },

        //coupon active
        // activePromotion: async () => {
        //     const { userId: clerkUserId } = await auth();

        //     // Find the logged-in customer, if there is one.
        //     const currentUser = clerkUserId
        //         ? await prisma.user.findUnique({
        //             where: { clerkId: clerkUserId },
        //             select: {
        //                 id: true,
        //                 orders: {
        //                     take: 1,
        //                     select: { id: true },
        //                 },
        //             },
        //         })
        //         : null;

        //     // A customer is considered "new" if they have never placed an order.
        //     const isNewUser =
        //         !!currentUser && currentUser.orders.length === 0;

        //     const promotions = await prisma.coupon.findMany({
        //         where: {
        //             isActive: true,
        //             isPromotional: true,

        //             promotionText: {
        //                 not: null,
        //             },

        //             OR: [
        //                 {
        //                     expiresAt: null,
        //                 },
        //                 {
        //                     expiresAt: {
        //                         gt: new Date(),
        //                     },
        //                 },
        //             ],

        //             // Existing users and guests can only see
        //             // coupons available to everyone.
        //             //
        //             // New users can see both:
        //             // - All-customer promotions
        //             // - New-user promotions
        //             ...(isNewUser
        //                 ? {}
        //                 : {
        //                     newUserOnly: false,
        //                 }),
        //         },

        //         orderBy: [
        //             {
        //                 priority: "desc",
        //             },
        //             {
        //                 createdAt: "desc",
        //             },
        //         ],
        //     });

        //     // Remove coupons that have reached their usage limit.
        //     const availablePromotion = promotions.find(
        //         (coupon) =>
        //             coupon.usageLimit == null ||
        //             coupon.usedCount < coupon.usageLimit
        //     );

        //     return availablePromotion ?? null;
        // },

        //update immediatley
        activePromotion: async () => {
            const { userId: clerkUserId } = await auth();

            let isNewUser = true;

            if (clerkUserId) {
                const currentUser = await prisma.user.findUnique({
                    where: {
                        clerkId: clerkUserId,
                    },
                    select: {
                        id: true,
                        orders: {
                            take: 1,
                            select: {
                                id: true,
                            },
                        },
                    },
                });

                // Logged-in user with at least one order = existing customer.
                isNewUser = !currentUser || currentUser.orders.length === 0;
            }

            const promotions = await prisma.coupon.findMany({
                where: {
                    isActive: true,

                    // Only coupons configured for the promotional/navbar bar.
                    isPromotional: true,

                    promotionText: {
                        not: null,
                    },

                    OR: [
                        {
                            expiresAt: null,
                        },
                        {
                            expiresAt: {
                                gt: new Date(),
                            },
                        },
                    ],

                    // Anonymous visitors + new customers:
                    //   can see both new-user and all-customer promotions.
                    //
                    // Existing customers:
                    //   can only see all-customer promotions.
                    ...(isNewUser
                        ? {}
                        : {
                            newUserOnly: false,
                        }),
                },

                orderBy: [
                    {
                        priority: "desc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],
            });

            const availablePromotion = promotions.find(
                (coupon) =>
                    coupon.usageLimit == null ||
                    coupon.usedCount < coupon.usageLimit
            );

            return availablePromotion ?? null;
        },
    },

    Mutation: {
        adminCreateCoupon: async (_: unknown, { input }: any) => {
            await assertAdmin();
            const code = normalizeCode(input.code);
            if (!code) throw new Error("Coupon code is required.");
            if (input.discountValue <= 0) throw new Error("Discount value must be greater than 0.");
            if (input.discountType === "PERCENTAGE" && input.discountValue > 100) {
                throw new Error("Percentage discount cannot exceed 100%.");
            }
            if (input.minimumOrder != null && input.minimumOrder < 0) throw new Error("Minimum order cannot be negative.");
            if (input.maximumDiscount != null && input.maximumDiscount < 0) throw new Error("Maximum discount cannot be negative.");
            if (input.usageLimit != null && input.usageLimit < 1) throw new Error("Usage limit must be at least 1.");

            return prisma.coupon.create({
                data: {
                    code,
                    description: input.description?.trim() || null,
                    campaignName: input.campaignName?.trim() || null,
                    promotionText: input.promotionText?.trim() || null,
                    discountType: input.discountType,
                    discountValue: input.discountValue,
                    minimumOrder: input.minimumOrder ?? null,
                    maximumDiscount: input.maximumDiscount ?? null,
                    usageLimit: input.usageLimit ?? null,
                    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
                    isActive: input.isActive ?? true,
                    isPromotional: input.isPromotional ?? false,
                    priority: input.priority ?? 0,
                    newUserOnly: input.newUserOnly ?? false,
                },
            });
        },

        adminUpdateCoupon: async (_: unknown, { id, input }: any) => {
            await assertAdmin();
            const existing = await prisma.coupon.findUnique({ where: { id } });
            if (!existing) throw new Error("Coupon not found.");

            const code = input.code !== undefined ? normalizeCode(input.code) : undefined;
            if (code !== undefined && !code) throw new Error("Coupon code is required.");
            const discountType = input.discountType ?? existing.discountType;
            const discountValue = input.discountValue ?? existing.discountValue;
            if (discountValue <= 0) throw new Error("Discount value must be greater than 0.");
            if (discountType === "PERCENTAGE" && discountValue > 100) throw new Error("Percentage discount cannot exceed 100%.");

            return prisma.coupon.update({
                where: { id },
                data: {
                    ...(code !== undefined ? { code } : {}),
                    ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
                    ...(input.campaignName !== undefined ? { campaignName: input.campaignName?.trim() || null } : {}),
                    ...(input.promotionText !== undefined ? { promotionText: input.promotionText?.trim() || null } : {}),
                    ...(input.discountType !== undefined ? { discountType } : {}),
                    ...(input.discountValue !== undefined ? { discountValue } : {}),
                    ...(input.minimumOrder !== undefined ? { minimumOrder: input.minimumOrder } : {}),
                    ...(input.maximumDiscount !== undefined ? { maximumDiscount: input.maximumDiscount } : {}),
                    ...(input.usageLimit !== undefined ? { usageLimit: input.usageLimit } : {}),
                    ...(input.expiresAt !== undefined ? { expiresAt: input.expiresAt ? new Date(input.expiresAt) : null } : {}),
                    ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
                    ...(input.isPromotional !== undefined ? { isPromotional: input.isPromotional } : {}),
                    ...(input.priority !== undefined ? { priority: input.priority } : {}),
                    ...(input.newUserOnly !== undefined ? { newUserOnly: input.newUserOnly } : {}),
                },
            });
        },

        adminDeleteCoupon: async (_: unknown, { id }: { id: string }) => {
            await assertAdmin();

            const existing = await prisma.coupon.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { orders: true },
                    },
                },
            });

            if (!existing) throw new Error("Coupon not found.");

            if (existing._count.orders > 0) {
                throw new Error(
                    "This coupon has already been used on customer orders and cannot be deleted. Deactivate it instead to stop future use."
                );
            }

            const result = await prisma.coupon.deleteMany({ where: { id } });

            return result.count > 0;
        },
    },
};
