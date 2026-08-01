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
                const order = await tx.order.findFirst({
                    where: {
                        stripePaymentIntentId: paymentIntent.id,
                    },
                });

                if (!order) return;

                if (order.paymentStatus === "PAID") return;

                await tx.order.update({
                    where: {
                        id: order.id,
                    },
                    data: {
                        paymentStatus: "PAID",
                        status: "CONFIRMED",
                    },
                });

                await tx.cartItem.deleteMany({
                    where: {
                        cart: {
                            userId: order.userId,
                        },
                    },
                });
            });

            break;
        }

        default:
            break;
    }

    return NextResponse.json({ received: true });
}