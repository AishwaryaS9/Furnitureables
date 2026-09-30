"use client";

import type { RefObject } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";
import StripePaymentForm, { StripePaymentFormRef } from "@/components/checkout/StripePaymentForm";
import { Address } from "@/types/address";

interface StripeSectionProps {
    formRef: RefObject<StripePaymentFormRef | null>;
    addresses: Address[];
}

/**
 * Everything that needs Stripe.js / react-stripe-js, in one module so the
 * checkout page can load it on demand (only when "Card" is selected).
 */
export default function StripeSection({ formRef, addresses }: StripeSectionProps) {
    return (
        <Elements stripe={stripePromise}>
            <StripePaymentForm ref={formRef} addresses={addresses} />
        </Elements>
    );
}
