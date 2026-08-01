import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { buildOrder } from "@/lib/order/buildOrder";
import { razorpay } from "@/lib/razorpay";
import { getStripe } from "@/lib/stripe";
import { PlaceOrderInput } from "@/types/order";

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
            const stripe = getStripe();
            const paymentIntent = await stripe.paymentIntents.create({
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
                        // couponCode: coupon?.code,
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
                            couponId: coupon?.id,
                            // couponCode: coupon?.code,
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
                            // quantity: existing.quantity + quantity,
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