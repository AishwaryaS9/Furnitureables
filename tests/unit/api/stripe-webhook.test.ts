// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/stripe/webhook/route";
import { confirmStripeOrderPayment } from "@/lib/order/confirmStripeOrder";
import { sendOrderConfirmedSideEffects } from "@/lib/order/onOrderConfirmed";
import { getStripe } from "@/lib/stripe";

vi.mock("@/lib/stripe", () => ({ getStripe: vi.fn() }));
vi.mock("@/lib/order/confirmStripeOrder", () => ({ confirmStripeOrderPayment: vi.fn() }));
vi.mock("@/lib/order/onOrderConfirmed", () => ({ sendOrderConfirmedSideEffects: vi.fn() }));

const constructEvent = vi.fn();

function webhook(body = '{"id":"evt_1"}', headers: Record<string, string> = { "stripe-signature": "sig_1" }) {
    return POST(
        new NextRequest("http://localhost/api/stripe/webhook", { method: "POST", body, headers })
    );
}

const succeeded = (metadata: Record<string, string> = { orderId: "order-1" }) => ({
    type: "payment_intent.succeeded",
    data: { object: { metadata } },
});

beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    vi.spyOn(console, "error").mockImplementation(() => { });

    vi.mocked(getStripe).mockReturnValue({ webhooks: { constructEvent } } as never);
    constructEvent.mockReturnValue(succeeded());
    vi.mocked(confirmStripeOrderPayment).mockResolvedValue({ order: { id: "order-1" }, justConfirmed: true } as never);
    vi.mocked(sendOrderConfirmedSideEffects).mockResolvedValue(undefined);
});

describe("POST /api/stripe/webhook", () => {
    describe("signature", () => {
        it("rejects a request without a stripe-signature header", async () => {
            const response = await webhook('{"id":"evt_1"}', {});

            expect(response.status).toBe(400);
            await expect(response.json()).resolves.toEqual({ error: "Missing signature" });
            expect(constructEvent).not.toHaveBeenCalled();
        });

        it("rejects a request whose signature does not verify", async () => {
            constructEvent.mockImplementation(() => {
                throw new Error("No signatures found matching the expected signature");
            });

            const response = await webhook();

            expect(response.status).toBe(400);
            await expect(response.json()).resolves.toEqual({ error: "Invalid signature" });
            expect(confirmStripeOrderPayment).not.toHaveBeenCalled();
        });

        it("verifies the raw body with the signature header and the webhook secret", async () => {
            await webhook('{"raw":"body"}', { "stripe-signature": "sig_abc" });

            expect(constructEvent).toHaveBeenCalledWith('{"raw":"body"}', "sig_abc", "whsec_test");
        });
    });

    describe("payment_intent.succeeded", () => {
        it("confirms the order named in the payment's metadata", async () => {
            const response = await webhook();

            expect(response.status).toBe(200);
            await expect(response.json()).resolves.toEqual({ received: true });
            expect(confirmStripeOrderPayment).toHaveBeenCalledWith("order-1");
        });

        it("sends confirmation emails when the order was just confirmed", async () => {
            await webhook();

            expect(sendOrderConfirmedSideEffects).toHaveBeenCalledWith("order-1");
        });

        it("does not send them again when the order was already confirmed (Stripe retries)", async () => {
            vi.mocked(confirmStripeOrderPayment).mockResolvedValue({ order: { id: "order-1" }, justConfirmed: false } as never);

            const response = await webhook();

            expect(response.status).toBe(200);
            expect(sendOrderConfirmedSideEffects).not.toHaveBeenCalled();
        });

        it("does not send emails when the order cannot be found", async () => {
            vi.mocked(confirmStripeOrderPayment).mockResolvedValue(null);

            const response = await webhook();

            expect(response.status).toBe(200);
            expect(sendOrderConfirmedSideEffects).not.toHaveBeenCalled();
        });

        it("ignores a payment that has no orderId in its metadata", async () => {
            constructEvent.mockReturnValue(succeeded({}));

            const response = await webhook();

            expect(response.status).toBe(200);
            expect(confirmStripeOrderPayment).not.toHaveBeenCalled();
        });

        it("still answers 200 when the confirmation email fails", async () => {
            vi.mocked(sendOrderConfirmedSideEffects).mockRejectedValue(new Error("SMTP down"));

            const response = await webhook();

            expect(response.status).toBe(200);
        });
    });

    it("acknowledges other event types without doing anything", async () => {
        constructEvent.mockReturnValue({ type: "charge.refunded", data: { object: {} } });

        const response = await webhook();

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ received: true });
        expect(confirmStripeOrderPayment).not.toHaveBeenCalled();
    });
});
