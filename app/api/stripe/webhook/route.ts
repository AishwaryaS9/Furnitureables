import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { sendOrderConfirmedSideEffects } from "@/lib/order/onOrderConfirmed";
import { confirmStripeOrderPayment } from "@/lib/order/confirmStripeOrder";

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

            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            const orderId = paymentIntent.metadata.orderId;

            if (!orderId) {
                console.error("Missing orderId in Stripe metadata");
                break;
            }

            const result = await confirmStripeOrderPayment(orderId);

            if (result?.justConfirmed) {
                void sendOrderConfirmedSideEffects(result.order.id).catch((error) => {
                    console.error("Failed to run post-order side effects:", error);
                });
            }

            break;
        }

        default:
            break;
    }

    return NextResponse.json({ received: true });
}