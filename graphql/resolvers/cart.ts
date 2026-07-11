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

export const cartResolver = {
    Query: {
        cart: async () => {
            const user = await getCurrentUser();

            return prisma.cart.findUnique({
                where: {
                    userId: user.id,
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        },
    },

    Mutation: {
        saveCart: async (_: unknown, { items }: any) => {
            const user = await getCurrentUser();

            let cart = await prisma.cart.findUnique({
                where: {
                    userId: user.id,
                },
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: {
                        userId: user.id,
                    },
                });
            }

            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            });

            if (items.length) {
                await prisma.cartItem.createMany({
                    data: items.map((item: any) => ({
                        cartId: cart!.id,
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                });
            }

            return prisma.cart.findUnique({
                where: {
                    id: cart.id,
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        },
    },
};