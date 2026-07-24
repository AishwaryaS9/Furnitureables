import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@/generated/prisma";
import { buildOrder } from "@/lib/order/buildOrder";
import { razorpay } from "@/lib/razorpay";

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
        createRazorpayOrder: async (
            _: unknown,
            {
                input,
            }: {
                input: PlaceOrderInput;
            }
        ) => {
            const user = await getCurrentUser();
            console.log("Current Prisma user:", user);
            console.log("GraphQL input:", input);
            console.log("Passing to buildOrder", {
                userId: user.id,
                addressId: input.addressId,
            });
            const {
                cart,
                address,
                subtotal,
                shipping,
                tax,
                discount,
                total,
                orderNumber,
            } = await buildOrder(
                user.id,
                input.addressId
            );

            // Create Razorpay Order
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(total * 100),
                currency: "INR",
                receipt: orderNumber,
            });

            const order = await prisma.$transaction(async (tx) => {

                // Create Order
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

                        paymentMethod: "RAZORPAY",

                        status: "PENDING",

                        paymentStatus: "PENDING",

                        razorpayOrderId: razorpayOrder.id,

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

                // Create Order Items
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

                return order;
            });

            return {
                orderId: order.id,
                razorpayOrderId: razorpayOrder.id,
                amount: total,
                currency: "INR",
            };
        },
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

                const {
                    cart,
                    address,
                    subtotal,
                    shipping,
                    tax,
                    discount,
                    total,
                    orderNumber,
                } = await buildOrder(
                    user.id,
                    input.addressId
                );

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

                            // status: "PENDING",
                            status: "CONFIRMED",

                            // paymentStatus: "PENDING",
                            paymentStatus:
                                input.paymentMethod === "COD"
                                    ? "PENDING"
                                    : "PAID",

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

        cancelOrder: async (
            _: unknown,
            {
                id,
            }: {
                id: string;
            }
        ) => {
            const user = await getCurrentUser();

            return prisma.$transaction(async (tx) => {
                const order = await tx.order.findFirst({
                    where: {
                        id,
                        userId: user.id,
                    },
                    include: {
                        items: true,
                    },
                });

                if (!order) {
                    throw new Error("Order not found.");
                }

                if (order.status !== "CONFIRMED") {
                    throw new Error(
                        "Only confirmed orders can be cancelled."
                    );
                }

                // Restore stock
                for (const item of order.items) {
                    await tx.product.update({
                        where: {
                            id: item.productId,
                        },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }

                return tx.order.update({
                    where: {
                        id: order.id,
                    },
                    data: {
                        status: "CANCELLED",
                    },
                });
            });
        },
    },
};