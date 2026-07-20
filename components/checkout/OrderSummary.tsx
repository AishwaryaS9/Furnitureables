"use client";

import { Button } from "@/components/ui/button";
import { Cart } from "@/types/cart";
import { useCheckoutStore } from "@/store/checkout";

interface OrderSummaryProps {
    cart?: Cart | null;

    selectedAddressId?: string;

    onCheckout: () => void | Promise<void>;

    loading?: boolean;
}

export default function OrderSummary({ cart, selectedAddressId, onCheckout, loading }: OrderSummaryProps) {

    const { paymentMethod } = useCheckoutStore();

    const items = cart?.items ?? [];

    const subtotal = items.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    const shipping = 0;
    const tax = 0;
    const discount = 0;

    const total =
        subtotal + shipping + tax - discount;

    return (
        <aside className="rounded-2xl border bg-card p-6 shadow-sm h-fit">

            <h2 className="text-xl font-semibold">
                Order Summary
            </h2>

            <div className="mt-6 space-y-4">

                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Items
                    </span>

                    <span>{items.length}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Subtotal
                    </span>

                    <span>
                        ₹{subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Shipping
                    </span>

                    <span>
                        ₹{shipping.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Tax
                    </span>

                    <span>
                        ₹{tax.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Discount
                    </span>

                    <span>
                        -₹{discount.toFixed(2)}
                    </span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>

                    <span>
                        ₹{total.toFixed(2)}
                    </span>
                </div>

                <div className="border-t pt-4 text-sm">
                    <div className="flex justify-between">
                        <span>Payment</span>

                        <span>
                            {paymentMethod === "COD"
                                ? "Cash on Delivery"
                                : "Card"}
                        </span>
                    </div>
                </div>

            </div>

            <Button
                className="mt-8 w-full"
                onClick={onCheckout}
                disabled={
                    loading ||
                    !selectedAddressId ||
                    items.length === 0
                }
            >
                {loading ? "Placing Order..." : "Place Order"}
            </Button>

            {!selectedAddressId && (
                <p className="mt-3 text-center text-sm text-muted-foreground">
                    Please select a delivery address.
                </p>
            )}

        </aside>
    );
}