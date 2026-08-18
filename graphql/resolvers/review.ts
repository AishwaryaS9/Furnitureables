import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth/admin";

async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) throw new Error("User not found");

    return user;
}

async function getOptionalCurrentUser() {
    const { userId } = await auth();
    if (!userId) return null;

    return prisma.user.findUnique({
        where: { clerkId: userId },
    });
}

function mapReview(review: any) {
    return {
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
        author: {
            id: review.user.id,
            name:
                [review.user.firstName, review.user.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                review.user.email.split("@")[0] ||
                "Customer",
        },
        product: {
            id: review.product.id,
            title: review.product.title,
            image: review.product.media?.[0]?.url ?? null,
        },
    };
}

const reviewInclude = {
    user: {
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
        },
    },
    product: {
        select: {
            id: true,
            title: true,
            media: {
                select: { url: true },
                orderBy: { sortOrder: "asc" as const },
                take: 1,
            },
        },
    },
};

async function getProductReviewData(productId: string) {
    const user = await getOptionalCurrentUser();

    const [reviews, total, aggregate, currentUserReview] = await Promise.all([
        prisma.review.findMany({
            where: { productId, status: "APPROVED" },
            orderBy: { createdAt: "desc" },
            include: reviewInclude,
        }),
        prisma.review.count({
            where: { productId, status: "APPROVED" },
        }),
        prisma.review.aggregate({
            where: { productId, status: "APPROVED" },
            _avg: { rating: true },
        }),
        user
            ? prisma.review.findUnique({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId,
                    },
                },
                include: reviewInclude,
            })
            : null,
    ]);

    let canReview = false;

    if (user && !currentUserReview) {
        const deliveredPurchase = await prisma.order.findFirst({
            where: {
                userId: user.id,
                status: "DELIVERED",
                items: { some: { productId } },
            },
            select: { id: true },
        });

        canReview = Boolean(deliveredPurchase);
    }

    return {
        reviews: reviews.map(mapReview),
        total,
        averageRating: Number(aggregate._avg.rating ?? 0),
        canReview,
        currentUserReview: currentUserReview ? mapReview(currentUserReview) : null,
    };
}

async function assertAdmin() {
    const admin = await getAdminUser();
    if (!admin) throw new Error("Forbidden");
    return admin;
}

export const reviewResolver = {
    Query: {
        productReviews: async (_: unknown, { productId }: { productId: string }) => {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                select: { id: true },
            });

            if (!product) throw new Error("Product not found.");

            return getProductReviewData(productId);
        },

        adminReviews: async (
            _: unknown,
            { status }: { status?: "PENDING" | "APPROVED" | "REJECTED" }
        ) => {
            await assertAdmin();

            const reviews = await prisma.review.findMany({
                where: status ? { status } : undefined,
                orderBy: { createdAt: "desc" },
                include: reviewInclude,
            });

            return reviews.map(mapReview);
        },
    },

    Mutation: {
        createReview: async (
            _: unknown,
            { input }: {
                input: {
                    productId: string;
                    rating: number;
                    title?: string | null;
                    comment?: string | null;
                };
            }
        ) => {
            const user = await getCurrentUser();

            if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
                throw new Error("Rating must be between 1 and 5.");
            }

            const product = await prisma.product.findUnique({
                where: { id: input.productId },
                select: { id: true },
            });

            if (!product) throw new Error("Product not found.");

            const deliveredPurchase = await prisma.order.findFirst({
                where: {
                    userId: user.id,
                    status: "DELIVERED",
                    items: { some: { productId: input.productId } },
                },
                select: { id: true },
            });

            if (!deliveredPurchase) {
                throw new Error("You can review a product only after it has been delivered.");
            }

            const existing = await prisma.review.findUnique({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId: input.productId,
                    },
                },
                select: { id: true },
            });

            if (existing) throw new Error("You have already reviewed this product.");

            const review = await prisma.review.create({
                data: {
                    userId: user.id,
                    productId: input.productId,
                    rating: input.rating,
                    title: input.title?.trim() || null,
                    comment: input.comment?.trim() || null,
                    status: "PENDING",
                },
                include: reviewInclude,
            });

            return mapReview(review);
        },

        updateReview: async (
            _: unknown,
            { id, input }: {
                id: string;
                input: {
                    rating?: number | null;
                    title?: string | null;
                    comment?: string | null;
                };
            }
        ) => {
            const user = await getCurrentUser();

            if (
                input.rating !== undefined &&
                input.rating !== null &&
                (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)
            ) {
                throw new Error("Rating must be between 1 and 5.");
            }

            const existing = await prisma.review.findFirst({
                where: { id, userId: user.id },
            });

            if (!existing) throw new Error("Review not found.");

            const review = await prisma.review.update({
                where: { id },
                data: {
                    ...(input.rating !== undefined && input.rating !== null
                        ? { rating: input.rating }
                        : {}),
                    ...(input.title !== undefined ? { title: input.title?.trim() || null } : {}),
                    ...(input.comment !== undefined ? { comment: input.comment?.trim() || null } : {}),
                    status: "PENDING",
                },
                include: reviewInclude,
            });

            return mapReview(review);
        },

        deleteReview: async (_: unknown, { id }: { id: string }) => {
            const user = await getCurrentUser();

            const result = await prisma.review.deleteMany({
                where: { id, userId: user.id },
            });

            return result.count > 0;
        },

        adminUpdateReviewStatus: async (
            _: unknown,
            { id, status }: {
                id: string;
                status: "PENDING" | "APPROVED" | "REJECTED";
            }
        ) => {
            await assertAdmin();

            const review = await prisma.review.update({
                where: { id },
                data: { status },
                include: reviewInclude,
            });

            return mapReview(review);
        },

        adminDeleteReview: async (_: unknown, { id }: { id: string }) => {
            await assertAdmin();

            const result = await prisma.review.deleteMany({ where: { id } });

            return result.count > 0;
        },
    },
};
