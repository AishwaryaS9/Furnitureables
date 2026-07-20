"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAddresses } from "@/hooks/useAddresses";
import { useCart } from "@/hooks/useCart";
import AddressSelector from "./AddressSelector";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import CheckoutSkeleton from "./CheckoutSkeleton";

export default function CheckoutPage() {
    const { user } = useUser();

    const { data: addresses, isLoading: addressesLoading } = useAddresses(user?.id);

    const { data: cart, isLoading: cartLoading } = useCart(user?.id);

    const [selectedAddressId, setSelectedAddressId] = useState<string>();

    useEffect(() => {
        if (
            addresses?.length &&
            !selectedAddressId
        ) {
            const defaultAddress =
                addresses.find((a) => a.isDefault);

            setSelectedAddressId(
                defaultAddress?.id ?? addresses[0].id
            );
        }
    }, [addresses, selectedAddressId]);

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
                        onSelect={setSelectedAddressId}
                    />

                    <PaymentMethod />

                </div>

                <OrderSummary
                    cart={cart}
                    selectedAddressId={selectedAddressId}
                />

            </div>

        </div>
    );
}