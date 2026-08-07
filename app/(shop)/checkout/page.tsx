"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useAddresses } from "@/hooks/useAddresses";
import { useCart } from "@/hooks/useCart";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { useCreateRazorpayOrder } from "@/hooks/useCreateRazorpayOrder";
import { useVerifyRazorpayPayment } from "@/hooks/useVerifyRazorpayPayment";
import { useCheckoutStore } from "@/store/checkout";
import { useCartStore } from "@/store/cart";
import { useCouponStore } from "@/store/coupon";
import AddressSelector from "@/components/checkout/AddressSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import StripePaymentForm, { StripePaymentFormRef } from "@/components/checkout/StripePaymentForm";
import { RazorpayOptions, RazorpayResponse } from "@/types/razorpay";
import { toast } from "sonner";
import { ShieldCheck, Lock, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";

export default function CheckoutPage() {
    const { user } = useUser();
    const stripeFormRef = useRef<StripePaymentFormRef>(null);
    const router = useRouter();

    const placeOrder = usePlaceOrder();
    const createRazorpayOrder = useCreateRazorpayOrder();
    const verifyRazorpayPayment = useVerifyRazorpayPayment();

    const { selectedAddressId, setSelectedAddress, paymentMethod, setPaymentMethod, clearCheckout } = useCheckoutStore();

    const clearCart = useCartStore((s) => s.clearCart);
    const coupon = useCouponStore((s) => s.coupon);
    const clearCoupon = useCouponStore((s) => s.clearCoupon);

    const { data: addresses } = useAddresses(user?.id);

    const { data: cart } = useCart(user?.id);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (!addresses?.length) return;

        const stillExists = addresses.some(
            (a) => a.id === selectedAddressId
        );

        if (!stillExists) {
            const defaultAddress =
                addresses.find((a) => a.isDefault) ??
                addresses[0];

            setSelectedAddress(defaultAddress.id);
        }
    }, [addresses, selectedAddressId, setSelectedAddress]);

    async function handlePlaceOrder() {
        const addressId =
            selectedAddressId ||
            addresses?.find((a) => a.isDefault)?.id ||
            addresses?.[0]?.id;

        if (!addressId) {
            toast.error("Please select a delivery address.");
            return;
        }
        try {
            if (paymentMethod === "COD") {
                const result = await placeOrder.mutateAsync({
                    addressId,
                    paymentMethod,
                    couponId: coupon?.id,
                });

                toast.success("Order placed successfully!");

                await queryClient.invalidateQueries({
                    queryKey: ["cart", user?.id],
                });

                await queryClient.refetchQueries({
                    queryKey: ["cart", user?.id],
                });
                clearCart();
                clearCheckout();
                clearCoupon();
                router.push(`/orders/${result.placeOrder.id}`);

                return;
            }
            if (paymentMethod === "RAZORPAY") {
                const result = await createRazorpayOrder.mutateAsync({
                    addressId,
                    paymentMethod: "RAZORPAY",
                    couponId: coupon?.id,
                });

                const razorpayOrder = result.createRazorpayOrder;

                const options: RazorpayOptions = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                    amount: razorpayOrder.amount * 100,
                    currency: razorpayOrder.currency,

                    name: "Furnitureables",

                    description: "Order Payment",

                    order_id: razorpayOrder.razorpayOrderId,

                    handler: async (response: RazorpayResponse) => {
                        try {
                            const verifyResult = await verifyRazorpayPayment.mutateAsync({
                                orderId: razorpayOrder.orderId,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            });

                            await queryClient.invalidateQueries({
                                queryKey: ["cart", user?.id],
                            });

                            await queryClient.refetchQueries({
                                queryKey: ["cart", user?.id],
                            });

                            toast.success("Payment successful! Order confirmed.");
                            clearCart();
                            clearCheckout();
                            clearCoupon();
                            router.push(
                                `/orders/${verifyResult.verifyRazorpayPayment.id}`
                            );
                            return;
                        } catch (error) {
                            console.error("Payment verification failed", error);
                            toast.error(
                                "We couldn't verify your payment. Please contact support if the amount was debited."
                            );
                        }
                    },

                    prefill: {
                        name: user?.fullName ?? "",
                        email: user?.primaryEmailAddress?.emailAddress ?? "",
                        contact: "",
                    },

                    theme: {
                        color: "#111827",
                    },

                    modal: {
                        ondismiss: () => {
                            toast.error("Payment cancelled.");
                        },
                    },
                };

                const razorpay = new window.Razorpay(options);

                razorpay.open();
                return;
            }

            if (paymentMethod === "STRIPE") {
                // Stripe flow
                await stripeFormRef.current?.submit();
                return;
            }

        } catch (error) {
            console.error(error);
            toast.error("Unable to place order.");
        }
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

            <main
                id="main-content"
                tabIndex={-1}
                className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background transition-colors duration-200"
            >
                <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">

                    {/* Page Header with Trust Security Badge */}
                    <header className="border-b border-border/60 pb-6 mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-foreground">
                                Secure Checkout
                            </h1>
                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                                Complete your order matrix & architectural delivery configuration
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 bg-secondary/80 border border-border/60 rounded-full px-3.5 py-1.5 backdrop-blur-md shadow-xs self-start sm:self-auto">
                            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            <span className="text-xs font-semibold text-foreground/90 tracking-tight">
                                Secure Payment Gateway
                            </span>
                        </div>
                    </header>

                    {/* Step Visual Guide Bar */}
                    <nav aria-label="Checkout process steps" className="mb-8">
                        <ol className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl text-xs font-medium">
                            <li className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-card border border-border shadow-xs text-foreground">
                                <div className="w-6 h-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-[10px] shrink-0">
                                    1
                                </div>
                                <span className="hidden sm:inline font-serif truncate">Shipping Address</span>
                                <MapPin className="w-3.5 h-3.5 sm:hidden shrink-0 text-muted-foreground" aria-hidden="true" />
                            </li>

                            <li className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-card border border-border shadow-xs text-foreground">
                                <div className="w-6 h-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-[10px] shrink-0">
                                    2
                                </div>
                                <span className="hidden sm:inline font-serif truncate">Payment Method</span>
                                <CreditCard className="w-3.5 h-3.5 sm:hidden shrink-0 text-muted-foreground" aria-hidden="true" />
                            </li>

                            <li className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-card border border-border shadow-xs text-foreground">
                                <div className="w-6 h-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-[10px] shrink-0">
                                    3
                                </div>
                                <span className="hidden sm:inline font-serif truncate">Order Summary</span>
                                <ShoppingBag className="w-3.5 h-3.5 sm:hidden shrink-0 text-muted-foreground" aria-hidden="true" />
                            </li>
                        </ol>
                    </nav>

                    {/* Main Checkout Split */}
                    <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 items-start">

                        {/* Left Column: Delivery Address & Payment Selector */}
                        <div className="space-y-8 lg:col-span-7 xl:col-span-8">

                            <section aria-label="Shipping Address Selection" className="space-y-4">
                                <AddressSelector
                                    addresses={addresses ?? []}
                                    selectedAddressId={selectedAddressId}
                                    onSelect={setSelectedAddress}
                                />
                            </section>

                            <section aria-label="Payment Method Selection" className="space-y-4">
                                <PaymentMethodSelector
                                    value={paymentMethod}
                                    onChange={setPaymentMethod}
                                />

                                {paymentMethod === "STRIPE" && (
                                    <div className="pt-4 border-t border-border/60">
                                        <Elements stripe={stripePromise}>
                                            <StripePaymentForm
                                                ref={stripeFormRef}
                                                addresses={addresses ?? []}
                                            />
                                        </Elements>
                                    </div>
                                )}
                            </section>

                        </div>

                        {/* Right Column: Order Ledger & Final Checkout Action */}
                        <aside aria-label="Order Summary" className="lg:col-span-5 xl:col-span-4 sticky top-28">
                            <OrderSummary
                                cart={cart}
                                selectedAddressId={selectedAddressId}
                                onCheckout={handlePlaceOrder}
                                loading={placeOrder.isPending || createRazorpayOrder.isPending}
                            />

                            {/* Trust Guarantee Card */}
                            <div className="mt-4 p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center gap-3 text-xs text-muted-foreground">
                                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                                <p className="font-light leading-relaxed">
                                    Your personal & billing details are guarded under official SSL encrypted protocols.
                                </p>
                            </div>
                        </aside>

                    </div>

                </div>
            </main>
        </>
    );
}