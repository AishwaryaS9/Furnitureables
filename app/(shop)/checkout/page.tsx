"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAddresses } from "@/hooks/useAddresses";
import { useCart } from "@/hooks/useCart";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { useCheckoutStore } from "@/store/checkout";
import CheckoutSkeleton from "@/components/checkout/CheckoutSkeleton";
import AddressSelector from "@/components/checkout/AddressSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import { toast } from "sonner";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector.tsx";
import { useCreateRazorpayOrder } from "@/hooks/useCreateRazorpayOrder";

import Script from "next/script";
import { RazorpayOptions, RazorpayResponse } from "@/types/razorpay";

export default function CheckoutPage() {
    const { user } = useUser();

    const router = useRouter();

    const placeOrder = usePlaceOrder();
    const createRazorpayOrder = useCreateRazorpayOrder();

    const { selectedAddressId, setSelectedAddress, paymentMethod, setPaymentMethod, clearCheckout } = useCheckoutStore();

    const { data: addresses, isLoading: addressesLoading } = useAddresses(user?.id);

    const { data: cart, isLoading: cartLoading } = useCart(user?.id);

    async function handlePlaceOrder() {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address.");
            return;
        }

        try {
            if (paymentMethod === "COD") {
                const result = await placeOrder.mutateAsync({
                    addressId: selectedAddressId,
                    paymentMethod,
                });

                toast.success("Order placed successfully!");

                clearCheckout();

                router.push(`/orders/${result.placeOrder.id}`);

                return;
            }
            if (paymentMethod === "RAZORPAY") {
                const result = await createRazorpayOrder.mutateAsync({
                    addressId: selectedAddressId,
                    paymentMethod: "RAZORPAY",
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
                        console.log("Razorpay response", response);

                        // We'll verify payment here next.
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
                // Open Razorpay
                return;
            }

            if (paymentMethod === "STRIPE") {
                // Stripe flow
            }

        } catch (error) {
            console.error(error);

            toast.error("Unable to place order.");
        }
    }

    useEffect(() => {
        if (!addresses?.length) return;

        if (!selectedAddressId) {
            const defaultAddress =
                addresses.find((a) => a.isDefault) ??
                addresses[0];

            setSelectedAddress(defaultAddress.id);
        }
    }, [addresses, selectedAddressId, setSelectedAddress]);

    if (addressesLoading || cartLoading) {
        return <CheckoutSkeleton />;
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            <div className="mx-auto max-w-7xl px-4 py-10">

                <h1 className="mb-8 text-4xl font-serif">
                    Checkout
                </h1>

                <div className="grid gap-10 lg:grid-cols-3">

                    <div className="space-y-8 lg:col-span-2">

                        <AddressSelector
                            addresses={addresses ?? []}
                            selectedAddressId={selectedAddressId}
                            onSelect={setSelectedAddress}
                        />

                        <PaymentMethodSelector
                            value={paymentMethod}
                            onChange={setPaymentMethod}
                        />

                    </div>

                    <OrderSummary
                        cart={cart}
                        selectedAddressId={selectedAddressId}
                        onCheckout={handlePlaceOrder}
                        loading={placeOrder.isPending}
                    />
                </div>

            </div>
        </>
    );
}