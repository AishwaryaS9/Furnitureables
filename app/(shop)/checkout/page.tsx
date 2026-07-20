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

export default function CheckoutPage() {
    const { user } = useUser();

    const router = useRouter();

    const placeOrder = usePlaceOrder();

    const { selectedAddressId, setSelectedAddress, paymentMethod, setPaymentMethod, clearCheckout } = useCheckoutStore();

    const { data: addresses, isLoading: addressesLoading } = useAddresses(user?.id);

    const { data: cart, isLoading: cartLoading } = useCart(user?.id);

    async function handlePlaceOrder() {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address.");
            return;
        }

        try {
            const result = await placeOrder.mutateAsync({
                addressId: selectedAddressId,
                paymentMethod,
            });

            toast.success("Order placed successfully!");

            // Clear checkout selections
            clearCheckout();

            // Redirect to order details
            router.push(`/orders/${result.placeOrder.id}`);
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
    );
}