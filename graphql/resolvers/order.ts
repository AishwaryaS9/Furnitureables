import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@/generated/prisma";
import { generateOrderNumber } from "@/lib/order";

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

interface PlaceOrderInput {
    addressId: string;
    paymentMethod: PaymentMethod;
}

export const orderResolver = {
    Query: {
        orders: async () => {
            const user = await getCurrentUser();

            return prisma.order.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    items: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        },

        order: async (
            _: unknown,
            {
                id,
            }: {
                id: string;
            }
        ) => {
            const user = await getCurrentUser();

            return prisma.order.findFirst({
                where: {
                    id,
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
        placeOrder: async (
            _: unknown,
            {
                input,
            }: {
                input: PlaceOrderInput;
            }
        ) => {
            try {
                const user = await getCurrentUser();

                // Load cart
                const cart = await prisma.cart.findUnique({
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

                if (!cart || cart.items.length === 0) {
                    throw new Error("Cart is empty.");
                }

                // Load selected address
                const address = await prisma.address.findFirst({
                    where: {
                        id: input.addressId,
                        userId: user.id,
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

                // Generate order number
                const orderNumber = generateOrderNumber();

                // return prisma.$transaction(async (tx) => {
                return await prisma.$transaction(async (tx) => {

                    // 1. Create Order
                    const order = await tx.order.create({
                        data: {
                            orderNumber,

                            userId: user.id,
                            addressId: address.id,

                            subtotal,
                            shipping,
                            tax,
                            discount,
                            total,

                            currency: "INR",

                            paymentMethod: input.paymentMethod,

                            status: "PENDING",

                            paymentStatus: "PENDING",

                            fullName: address.fullName,

                            phoneCode: address.phoneCode,

                            phone: address.phone,

                            addressLine1: address.addressLine1,

                            addressLine2: address.addressLine2,

                            city: address.city,

                            state: address.state,

                            postalCode: address.postalCode,

                            country: address.country,
                        },
                    });

                    // 2. Create Order Items
                    await tx.orderItem.createMany({
                        data: cart.items.map((item) => ({
                            orderId: order.id,

                            productId: item.product.id,

                            title: item.product.title,

                            image: item.product.media[0]?.url,

                            sku: item.product.sku,

                            price: item.product.price,

                            quantity: item.quantity,
                        })),
                    });

                    // 3. Reduce Stock
                    for (const item of cart.items) {
                        if (item.product.stock < item.quantity) {
                            throw new Error(
                                `${item.product.title} is out of stock`
                            );
                        }

                        await tx.product.update({
                            where: {
                                id: item.product.id,
                            },
                            data: {
                                stock: {
                                    decrement: item.quantity,
                                },
                            },
                        });
                    }

                    // 4. Delete Cart Items
                    await tx.cartItem.deleteMany({
                        where: {
                            cartId: cart.id,
                        },
                    });
                    return order;
                });
            } catch (error) {
                console.error("========== PLACE ORDER ERROR ==========");
                console.error(error);
                throw error;
            }
        },
    },
};