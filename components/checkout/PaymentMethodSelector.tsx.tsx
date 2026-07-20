"use client";

import { CreditCard, Truck } from "lucide-react";
import { PaymentMethod } from "@/generated/prisma";

interface PaymentMethodProps {
    value: PaymentMethod;
    onChange: (value: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodProps) {
    return (
        <section className="space-y-5">
            <h2 className="text-xl font-semibold">
                Payment Method
            </h2>

            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => onChange("COD")}
                    className={`w-full rounded-xl border p-5 text-left transition ${value === "COD"
                        ? "border-black"
                        : "border-zinc-200"
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

                <button
                    type="button"
                    onClick={() => onChange("STRIPE")}
                    className={`w-full rounded-xl border p-5 text-left transition ${value === "STRIPE"
                        ? "border-black"
                        : "border-zinc-200"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />

                        <div>
                            <p className="font-medium">
                                Card Payment
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Secure online payment.
                            </p>
                        </div>
                    </div>
                </button>
            </div>
        </section>
    );
}