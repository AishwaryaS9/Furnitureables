"use client";

import { forwardRef, useImperativeHandle } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, ShieldCheck, Lock } from "lucide-react";
import { useCheckoutStore } from "@/store/checkout";
import { useCouponStore } from "@/store/coupon";
import { useCartStore } from "@/store/cart";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateStripePaymentIntent } from "@/hooks/useCreateStripePaymentIntent";
import { Address } from "@/types/address";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface StripePaymentFormProps {
    addresses: Address[];
}

export interface StripePaymentFormRef {
    submit: () => Promise<void>;
}

const StripePaymentForm = forwardRef<StripePaymentFormRef, StripePaymentFormProps>(
    function StripePaymentForm({ addresses }, ref) {
        const stripe = useStripe();
        const elements = useElements();

        const router = useRouter();
        const queryClient = useQueryClient();

        const { user } = useUser();

        const createStripePaymentIntent = useCreateStripePaymentIntent();

        const { selectedAddressId, clearCheckout } = useCheckoutStore();
        const clearCart = useCartStore((s) => s.clearCart);
        const setSyncedUserId = useCartStore((s) => s.setSyncedUserId);

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
                const result = await createStripePaymentIntent.mutateAsync({
                    addressId,
                    paymentMethod: "STRIPE",
                    couponId: coupon?.id,
                });

                const payment = result.createStripePaymentIntent;

                const card = elements.getElement(CardElement);

                if (!card) {
                    toast.error("Card details are missing.");
                    return;
                }

                const confirmation = await stripe.confirmCardPayment(
                    payment.clientSecret,
                    {
                        payment_method: {
                            card,
                        },
                    }
                );

                if (confirmation.error) {
                    toast.error(
                        confirmation.error.message ?? "Payment failed."
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
                setSyncedUserId(user?.id ?? null);
                clearCheckout();
                clearCoupon();

                const orderId = payment.orderId;
                router.push(`/orders/${orderId}`);

                return;
            } catch (error) {
                console.error(error);
                toast.error("Unable to complete payment.");
            }
        };

        useImperativeHandle(ref, () => ({
            submit: handleStripePayment,
        }));

        return (
            <Card className="rounded-2xl border-border/60 bg-card text-card-foreground shadow-xs">
                <CardHeader className="space-y-1 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary border border-border/60 text-primary">
                                <CreditCard className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <CardTitle className="font-serif text-lg font-normal tracking-tight text-foreground">
                                Card Information
                            </CardTitle>
                        </div>

                        <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/50">
                            <Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            <span>SSL Secured</span>
                        </div>
                    </div>

                    <CardDescription className="text-xs font-light text-muted-foreground">
                        Enter your credit or debit card details for encrypted order authorization
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="stripe-card-element" className="text-xs font-medium text-foreground">
                            Card Number & Details <span className="text-destructive">*</span>
                        </Label>

                        <div
                            id="stripe-card-element"
                            className="rounded-xl border border-input bg-secondary/30 p-3.5 transition-all focus-within:border-ring focus-within:ring-1 focus-within:ring-ring"
                        >
                            <CardElement
                                options={{
                                    hidePostalCode: true,
                                    style: {
                                        base: {
                                            fontSize: "14px",
                                            color: "var(--foreground, #09090b)",
                                            fontFamily: "var(--font-sans, system-ui, sans-serif)",
                                            "::placeholder": {
                                                color: "var(--muted-foreground, #71717a)",
                                            },
                                            iconColor: "var(--primary, #09090b)",
                                        },
                                        invalid: {
                                            color: "var(--destructive, #ef4444)",
                                            iconColor: "var(--destructive, #ef4444)",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground font-light">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                        <span>Your card details are processed directly via Stripe and are never stored on our servers.</span>
                    </div>
                </CardContent>
            </Card>
        );
    }
);

export default StripePaymentForm;