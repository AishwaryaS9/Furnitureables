"use client";

import { forwardRef, useImperativeHandle } from "react";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCheckoutStore } from "@/store/checkout";
import { useCouponStore } from "@/store/coupon";
import { useCartStore } from "@/store/cart";

import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

import { useCreateStripePaymentIntent } from "@/hooks/useCreateStripePaymentIntent";

import { Address } from "@/types/address";

interface StripePaymentFormProps {
    addresses: Address[];
}

export interface StripePaymentFormRef {
    submit: () => Promise<void>;
}

const StripePaymentForm = forwardRef<StripePaymentFormRef, StripePaymentFormProps>(function StripePaymentForm(
    {
        addresses,
    },
    ref
) {
    const stripe = useStripe();
    const elements = useElements();

    const router = useRouter();
    const queryClient = useQueryClient();

    const { user } = useUser();

    const createStripePaymentIntent = useCreateStripePaymentIntent();

    const { selectedAddressId, clearCheckout } = useCheckoutStore();
    const clearCart = useCartStore((s) => s.clearCart);

    const coupon = useCouponStore((s) => s.coupon);

    const clearCoupon = useCouponStore((s) => s.clearCoupon);

    const handleStripePayment = async () => {
        if (!stripe || !elements) return;

        const addressId =
            selectedAddressId ||
            addresses.find((a) => a.isDefault)?.id ||
            addresses[0]?.id;

        if (!addressId) {
            toast.error("Please select an address.");
            return;
        }

        try {
            const result =
                await createStripePaymentIntent.mutateAsync({
                    addressId,
                    paymentMethod: "STRIPE",
                    couponId: coupon?.id,
                });

            const payment =
                result.createStripePaymentIntent;

            const card =
                elements.getElement(CardElement);

            if (!card) {
                toast.error("Card details are missing.");
                return;
            }

            const confirmation =
                await stripe.confirmCardPayment(
                    payment.clientSecret,
                    {
                        payment_method: {
                            card,
                        },
                    }
                );

            if (confirmation.error) {
                toast.error(
                    confirmation.error.message ??
                    "Payment failed."
                );
                return;
            }

            toast.success("Payment successful!");

            await queryClient.invalidateQueries({
                queryKey: ["cart", user?.id],
            });

            await queryClient.fetchQuery({
                queryKey: ["cart", user?.id],
            });

            clearCart();
            clearCheckout();
            clearCoupon();

            router.push(`/orders/${payment.orderId}`);

        } catch (error) {
            console.error(error);
            toast.error("Unable to complete payment.");
        }
    };

    useImperativeHandle(ref, () => ({
        submit: handleStripePayment,
    }));

    return (
        <div className="mt-6 rounded-xl border p-5">
            <h3 className="mb-4 text-lg font-semibold">
                Card Details
            </h3>

            <div className="rounded-lg border p-4">
                <CardElement
                    options={{
                        hidePostalCode: true,
                    }}
                />
            </div>
        </div>
    );
});

export default StripePaymentForm;