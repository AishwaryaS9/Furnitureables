import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const body = await req.text();

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing signature" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;
    const stripe = getStripe();

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);

        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            console.log("Stripe webhook fired");

            const paymentIntent =
                event.data.object as Stripe.PaymentIntent;

            console.log("payment intend Id", paymentIntent.id);

            await prisma.$transaction(async (tx) => {
                const orderId = paymentIntent.metadata.orderId;

                if (!orderId) {
                    throw new Error("Missing orderId in Stripe metadata");
                }

                const order = await tx.order.findUnique({
                    where: {
                        id: orderId,
                    },
                    include: {
                        items: true,
                        coupon: true,
                    },
                });

                if (!order) return;

                if (order.paymentStatus === "PAID") {
                    return;
                }

                // Reduce stock
                for (const item of order.items) {
                    const updated = await tx.product.updateMany({
                        where: {
                            id: item.productId,
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
                        throw new Error(`${item.title} is out of stock`);
                    }
                }

                // Increment coupon usage
                if (order.couponId) {
                    await tx.coupon.update({
                        where: {
                            id: order.couponId,
                        },
                        data: {
                            usedCount: {
                                increment: 1,
                            },
                        },
                    });
                }

                // Update order
                await tx.order.update({
                    where: {
                        id: order.id,
                    },
                    data: {
                        paymentStatus: "PAID",
                        status: "CONFIRMED",
                    },
                });

                const itemsBefore = await tx.cartItem.findMany({
                    where: {
                        cart: {
                            userId: order.userId,
                        },
                    },
                });

                console.log("Items before delete:", itemsBefore);

                // Clear cart
                await tx.cartItem.deleteMany({
                    where: {
                        cart: {
                            userId: order.userId,
                        },
                    },
                });

                const deleted = await tx.cartItem.deleteMany({
                    where: {
                        cart: {
                            userId: order.userId,
                        },
                    },
                });

                console.log("Deleted count:", deleted.count);

                const itemsAfter = await tx.cartItem.findMany({
                    where: {
                        cart: {
                            userId: order.userId,
                        },
                    },
                });

                console.log("Items after delete:", itemsAfter);

            });



            break;
        }

        default:
            break;
    }

    return NextResponse.json({ received: true });
}