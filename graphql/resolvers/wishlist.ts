import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export const wishlistResolver = {
    Query: {
        wishlist: async () => {
            const user = await getCurrentUser();

            return prisma.wishlist.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    product: {
                        include: {
                            media: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        },
    },

    Mutation: {
        addToWishlist: async (
            _: unknown,
            {
                productId,
            }: {
                productId: string;
            }
        ) => {
            const user = await getCurrentUser();

            const existing = await prisma.wishlist.findUnique({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId,
                    },
                },
            });

            if (existing) {
                return existing;
            }

            return prisma.wishlist.create({
                data: {
                    userId: user.id,
                    productId,
                },
                include: {
                    product: {
                        include: {
                            media: true,
                        },
                    },
                },
            });
        },

        removeFromWishlist: async (
            _: unknown,
            {
                productId,
            }: {
                productId: string;
            }
        ) => {
            const user = await getCurrentUser();

            await prisma.wishlist.delete({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId,
                    },
                },
            });

            return true;
        },
    },
};