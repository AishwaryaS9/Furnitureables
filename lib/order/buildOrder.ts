import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/order";

export async function buildOrder(
    userId: string,
    addressId: string
) {
    // Load cart
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
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

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty.");
    }

    // Load address
    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId,
        },
    });

    if (!address) {
        throw new Error("Address not found.");
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
        (sum, item) =>
            sum + item.product.price * item.quantity,
        0
    );

    const shipping = subtotal >= 5000 ? 0 : 499;

    const tax = 0;

    const discount = 0;

    const total =
        subtotal +
        shipping +
        tax -
        discount;

    const orderNumber = generateOrderNumber();

    return {
        cart,
        address,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        orderNumber,
    };
}