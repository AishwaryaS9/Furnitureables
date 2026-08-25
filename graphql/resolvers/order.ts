import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { buildOrder } from "@/lib/order/buildOrder";
import { razorpay } from "@/lib/razorpay";
import { getStripe } from "@/lib/stripe";
import { PlaceOrderInput } from "@/types/order";
import { OrderStatus } from "@/generated/prisma";
import { sendOrderConfirmedSideEffects } from "@/lib/order/onOrderConfirmed";

const VALID_ORDER_STATUSES: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

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

export const orderResolver = {
    Query: {
        orders: async () => {
            const user = await getCurrentUser();

            return prisma.order.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    coupon: true,
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
                    coupon: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        },

        adminOrders: async () => {
            const orders = await prisma.order.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: {
                        select: {
                            email: true,
                        },
                    },
                    items: {
                        select: {
                            id: true,
                            title: true,
                            image: true,
                            price: true,
                            quantity: true,
                        },
                    },
                },
            });

            const orderItem = orders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.fullName,
                customerEmail: order.user?.email ?? "-",
                itemsCount: order.items.length,
                total: order.total,
                currency: order.currency,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt.toISOString(),
                items: order.items.map((item) => ({
                    id: item.id,
                    productName: item.title,
                    productImage: item.image,
                    quantity: item.quantity,
                    price: item.price,
                })),
            }));
            return orderItem
        },
    },

    Mutation: {
        createStripePaymentIntent: async (
            _: unknown,
            {
                input,
            }: {
                input: PlaceOrderInput;
            }
        ) => {
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
                coupon,
            } = await buildOrder(
                user.id,
                input.addressId,
                input.couponId
            );
            const stripeClient = getStripe();
            const paymentIntent = await stripeClient.paymentIntents.create({
                amount: Math.round(total * 100),
                currency: "inr",

                automatic_payment_methods: {
                    enabled: true,
                },

                metadata: {
                    orderNumber,
                    userId: user.id,
                },
            });

            if (!paymentIntent.client_secret) {
                throw new Error(
                    "Unable to create Stripe Payment Intent."
                );
            }

            const order = await prisma.$transaction(async (tx) => {

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

                        paymentMethod: "STRIPE",

                        status: "PENDING",
                        paymentStatus: "PENDING",

                        stripePaymentIntentId:
                            paymentIntent.id,

                        fullName: address.fullName,
                        phoneCode: address.phoneCode,
                        phone: address.phone,

                        addressLine1: address.addressLine1,
                        addressLine2: address.addressLine2,

                        city: address.city,
                        state: address.state,

                        postalCode: address.postalCode,
                        country: address.country,

                        couponId: coupon?.id,
                    },
                });

                await tx.orderItem.createMany({
                    data: cart.items.map((item) => ({
                        orderId: order.id,

                        productId: item.product.id,

                        title: item.product.title,

                        image:
                            item.product.media[0]?.url,

                        sku: item.product.sku,

                        price: item.product.price,

                        quantity: item.quantity,
                    })),
                });

                return order;
            });

            try {
                await stripeClient.paymentIntents.update(paymentIntent.id, {
                    metadata: {
                        orderId: order.id,
                        orderNumber,
                        userId: user.id,
                    },
                });
            } catch (error) {
                console.error("Failed to attach Stripe metadata", error);

                throw new Error(
                    "Unable to attach order metadata to Stripe PaymentIntent."
                );
            }

            return {
                orderId: order.id,
                clientSecret: paymentIntent.client_secret,
            };
        },

        createRazorpayOrder: async (
            _: unknown,
            {
                input,
            }: {
                input: PlaceOrderInput;
            }
        ) => {
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
                coupon,
            } = await buildOrder(
                user.id,
                input.addressId,
                input.couponId
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
                        couponId: coupon?.id,
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
                    coupon,
                } = await buildOrder(
                    user.id,
                    input.addressId,
                    input.couponId
                );

                const createdOrder = await prisma.$transaction(async (tx) => {

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

                            status: "CONFIRMED",

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
                            couponId: coupon?.id,
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
                        const updated = await tx.product.updateMany({
                            where: {
                                id: item.product.id,
                                stock: {
                                    gte: item.quantity,
                                },
                            },
                            data: {
                                stock: {
                                    decrement: item.quantity,
                                },
                            },
                        });

                        if (updated.count === 0) {
                            throw new Error(`${item.product.title} is out of stock`);
                        }
                    }

                    //4. Increment coupon usage (once)
                    if (coupon) {
                        await tx.coupon.update({
                            where: {
                                id: coupon.id,
                            },
                            data: {
                                usedCount: {
                                    increment: 1,
                                },
                            },
                        });
                    }

                    // 5. Delete Cart Items
                    await tx.cartItem.deleteMany({
                        where: {
                            cartId: cart.id,
                        },
                    });
                    return order;
                });

                void sendOrderConfirmedSideEffects(createdOrder.id).catch((error) => {
                    console.error("Failed to run post-order side effects:", error);
                });

                return createdOrder;
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

        adminUpdateOrderStatus: async (
            _: unknown,
            {
                id,
                status,
            }: {
                id: string;
                status: OrderStatus;
            }
        ) => {
            if (!VALID_ORDER_STATUSES.includes(status)) {
                throw new Error("Invalid order status.");
            }

            const existingOrder = await prisma.order.findUnique({
                where: { id },
            });

            if (!existingOrder) {
                throw new Error("Order not found.");
            }
            const shouldMarkCodAsPaid =
                status === "DELIVERED" &&
                existingOrder.paymentMethod === "COD" &&
                existingOrder.paymentStatus === "PENDING";

            const updateData = shouldMarkCodAsPaid
                ? { status, paymentStatus: "PAID" as const }
                : { status };

            // Restore stock if order is being cancelled
            if (
                status === "CANCELLED" &&
                existingOrder.status !== "CANCELLED"
            ) {
                await prisma.$transaction(async (tx) => {
                    const items = await tx.orderItem.findMany({
                        where: { orderId: id },
                    });

                    for (const item of items) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                stock: {
                                    increment: item.quantity,
                                },
                            },
                        });
                    }

                    await tx.order.update({
                        where: { id },
                        data: updateData,
                    });
                });
            } else {
                await prisma.order.update({
                    where: { id },
                    data: updateData,
                });
            }

            const order = await prisma.order.findUniqueOrThrow({
                where: { id },
                include: {
                    user: {
                        select: {
                            email: true,
                        },
                    },
                    items: {
                        select: {
                            id: true,
                            title: true,
                            image: true,
                            price: true,
                            quantity: true,
                        },
                    },
                },
            });

            return {
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.fullName,
                customerEmail: order.user?.email ?? "-",
                itemsCount: order.items.length,
                total: order.total,
                currency: order.currency,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt.toISOString(),
                items: order.items.map((item) => ({
                    id: item.id,
                    productName: item.title,
                    productImage: item.image,
                    quantity: item.quantity,
                    price: item.price,
                })),
            };
        },

        buyAgain: async (
            _: unknown,
            {
                orderId,
            }: {
                orderId: string;
            }
        ) => {
            const user = await getCurrentUser();

            const order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    userId: user.id,
                },
                include: {
                    items: true,
                },
            });

            if (!order) {
                throw new Error("Order not found.");
            }

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

            for (const item of order.items) {
                const product = await prisma.product.findUnique({
                    where: {
                        id: item.productId,
                    },
                });

                if (!product || product.stock <= 0) {
                    continue;
                }

                const quantity = Math.min(
                    item.quantity,
                    product.stock
                );

                const existing = await prisma.cartItem.findFirst({
                    where: {
                        cartId: cart.id,
                        productId: item.productId,
                    },
                });

                if (existing) {
                    await prisma.cartItem.update({
                        where: {
                            id: existing.id,
                        },
                        data: {
                            quantity: Math.min(
                                existing.quantity + quantity,
                                product.stock
                            ),
                        },
                    });
                } else {
                    await prisma.cartItem.create({
                        data: {
                            cartId: cart.id,
                            productId: item.productId,
                            quantity,
                        },
                    });
                }
            }

            return await prisma.cart.findUnique({
                where: {
                    id: cart.id,
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
        },
    },
};