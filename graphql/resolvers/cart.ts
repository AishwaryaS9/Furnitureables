import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

interface SaveCartInput {
    productId: string;
    quantity: number;
}

interface SaveCartArgs {
    items: SaveCartInput[];
}

async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    let user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        user = await prisma.user.upsert({
            where: { clerkId: userId },
            update: {
                email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
            },
            create: {
                clerkId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
            },
        });
    }

    return user;
}

export const cartResolver = {
    Query: {
        cart: async () => {
            const user = await getCurrentUser();

            let cart = await prisma.cart.findUnique({
                where: {
                    userId: user.id,
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    media: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: {
                        userId: user.id,
                    },
                    include: {
                        items: {
                            include: {
                                product: {
                                    include: {
                                        media: true,
                                    },
                                },
                            },
                        },
                    },
                });
            }

            return cart;
        },
    },

    Mutation: {
        saveCart: async (_: unknown, { items }: SaveCartArgs) => {
            const user = await getCurrentUser();

            let cart = await prisma.cart.findUnique({
                where: { userId: user.id },
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: { userId: user.id },
                });
            }

            const deduped = Array.from(
                items.reduce((map, item) => {
                    const existing = map.get(item.productId);
                    map.set(item.productId, {
                        productId: item.productId,
                        quantity: existing ? existing.quantity + item.quantity : item.quantity,
                    });
                    return map;
                }, new Map<string, { productId: string; quantity: number }>()).values()
            );

            await prisma.$transaction(async (tx) => {
                await tx.cartItem.deleteMany({
                    where: { cartId: cart.id },
                });

                if (deduped.length) {
                    await tx.cartItem.createMany({
                        data: deduped.map((item) => ({
                            cartId: cart.id,
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                        skipDuplicates: true,
                    });
                }
            });

            return prisma.cart.findUnique({
                where: { id: cart.id },
                include: {
                    items: { include: { product: true } },
                },
            });
        },
    },
};
