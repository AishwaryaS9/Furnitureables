"use client";

import { CreditCard, Truck, Landmark } from "lucide-react";
import { PaymentMethod } from "@/generated/prisma";

interface PaymentMethodProps {
    value: PaymentMethod;
    onChange: (value: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
    value,
    onChange,
}: PaymentMethodProps) {
    return (
        <section className="space-y-5">
            <h2 className="text-xl font-semibold">
                Payment Method
            </h2>

            <div className="space-y-4">

                {/* Cash on Delivery */}
                <button
                    type="button"
                    onClick={() => onChange("COD")}
                    className={`w-full rounded-xl border p-5 text-left transition ${value === "COD"
                            ? "border-black bg-muted/30"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5" />

                        <div>
                            <p className="font-medium">
                                Cash on Delivery
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Pay when your order arrives.
                            </p>
                        </div>
                    </div>
                </button>

                {/* Razorpay */}
                <button
                    type="button"
                    onClick={() => onChange("RAZORPAY")}
                    className={`w-full rounded-xl border p-5 text-left transition ${value === "RAZORPAY"
                            ? "border-black bg-muted/30"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <Landmark className="h-5 w-5" />

                        <div>
                            <p className="font-medium">
                                Razorpay
                            </p>

                            <p className="text-sm text-muted-foreground">
                                UPI, Cards, Net Banking & Wallets (India)
                            </p>
                        </div>
                    </div>
                </button>

                {/* Stripe */}
                <button
                    type="button"
                    onClick={() => onChange("STRIPE")}
                    className={`w-full rounded-xl border p-5 text-left transition ${value === "STRIPE"
                            ? "border-black bg-muted/30"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />

                        <div>
                            <p className="font-medium">
                                Stripe
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Credit/Debit Cards & International Payments
                            </p>
                        </div>
                    </div>
                </button>

            </div>
        </section>
    );
}