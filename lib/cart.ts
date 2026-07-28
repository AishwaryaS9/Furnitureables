import { prisma } from "@/lib/prisma";
import { CartItem, ServerCartItem } from "@/types/cart";

export async function getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
        where: {
            clerkId,
        },
    });
}

export async function getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    return cart;
}

export async function replaceCart(
    cartId: string,
    items: {
        id: string;
        quantity: number;
    }[]
) {
    await prisma.$transaction(async (tx) => {
        await tx.cartItem.deleteMany({
            where: {
                cartId,
            },
        });

        if (items.length === 0) return;

        await tx.cartItem.createMany({
            data: items.map((item) => ({
                cartId,
                productId: item.id,
                quantity: item.quantity,
            })),
        });
    });
}

export function mapServerCart(items: ServerCartItem[]): CartItem[] {
    return items.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.media[0]?.url,
        quantity: item.quantity,
    }));
}