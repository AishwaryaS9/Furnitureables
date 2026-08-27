"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Cart } from "@/types/cart";
import { useCheckoutStore } from "@/store/checkout";
import { useCouponStore } from "@/store/coupon";
import { Loader2, ArrowRight, ShieldCheck, Tag, CreditCard, Banknote, AlertTriangle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
    cart?: Cart | null;
    selectedAddressId?: string;
    onCheckout: () => void | Promise<void>;
    loading?: boolean;
}

export default function OrderSummary({
    cart,
    selectedAddressId,
    onCheckout,
    loading = false,
}: OrderSummaryProps) {
    const { paymentMethod } = useCheckoutStore();
    const coupon = useCouponStore((s) => s.coupon);
    const [itemsOpen, setItemsOpen] = useState(false);

    const buttonLabel =
        paymentMethod === "COD"
            ? "Place Order (COD)"
            : paymentMethod === "RAZORPAY"
                ? "Pay with Razorpay"
                : "Pay with Credit / Debit Card";

    const items = cart?.items ?? [];
    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

    const subtotal = items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    const shippingThreshold = 1500;
    const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 150;
    const discount = coupon?.discount ?? 0;
    const taxableAmount = Math.max(subtotal - discount, 0);
    const tax = taxableAmount * 0.08;

    const total = taxableAmount + shipping + tax;

    const isCheckoutDisabled =
        loading || !selectedAddressId || items.length === 0;

    return (
        <aside
            aria-label="Checkout order breakdown summary"
            className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs h-fit space-y-6 text-card-foreground backdrop-blur-xs"
        >
            {/* Summary Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <h2 className="text-xl font-serif font-normal tracking-tight text-foreground">
                    Order Summary
                </h2>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full border border-border/50">
                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </span>
            </div>

            {/* Collapsible Item Preview */}
            {items.length > 0 && (
                <div className="rounded-2xl border border-border/50 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setItemsOpen((v) => !v)}
                        aria-expanded={itemsOpen}
                        aria-controls="order-items-list"
                        className="w-full flex items-center justify-between px-4 py-3 bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                        <span className="text-xs font-medium text-foreground">
                            Review {itemCount} {itemCount === 1 ? "item" : "items"} in this order
                        </span>
                        <ChevronDown
                            className={cn(
                                "w-4 h-4 text-muted-foreground transition-transform duration-300",
                                itemsOpen && "rotate-180"
                            )}
                            aria-hidden="true"
                        />
                    </button>

                    <div
                        id="order-items-list"
                        className={cn(
                            "grid transition-all duration-300 ease-out",
                            itemsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        )}
                    >
                        <div className="overflow-hidden">
                            <ul className="divide-y divide-border/40 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <li
                                        key={item.id ?? item.product.id}
                                        className="flex items-center gap-3 px-4 py-3"
                                    >
                                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-secondary/50 border border-border/40">
                                            <Image
                                                src={item.product.media?.[0]?.url ?? "/images/placeholder.webp"}
                                                alt={item.product.title}
                                                fill
                                                sizes="48px"
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-foreground truncate">
                                                {item.product.title}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                Qty {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold text-foreground tabular-nums shrink-0">
                                            ₹{(item.product.price * item.quantity).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Breakdown Ledger */}
            <dl className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-muted-foreground font-light">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-foreground tabular-nums">
                        ₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </dd>
                </div>

                {coupon && (
                    <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-light animate-in fade-in duration-200">
                        <dt className="inline-flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Coupon ({coupon.code})</span>
                        </dt>
                        <dd className="font-semibold tabular-nums">
                            -₹{discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </dd>
                    </div>
                )}

                <div className="flex justify-between items-center text-muted-foreground font-light pt-2 border-t border-border/40">
                    <dt>White Glove Shipping</dt>
                    <dd className="font-semibold text-foreground tabular-nums">
                        {shipping === 0 ? (
                            <span className="text-emerald-700 dark:text-emerald-400 text-xs uppercase font-semibold tracking-wider">
                                Free
                            </span>
                        ) : (
                            `₹${shipping.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        )}
                    </dd>
                </div>

                <div className="flex justify-between items-center text-muted-foreground font-light pt-2 border-t border-border/40">
                    <dt>Estimated Taxes (8%)</dt>
                    <dd className="font-semibold text-foreground tabular-nums">
                        ₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </dd>
                </div>

                {/* Selected Payment Indicator */}
                <div className="flex justify-between items-center pt-2 border-t border-border/40 text-xs">
                    <dt className="text-muted-foreground font-light">Payment Method</dt>
                    <dd className="inline-flex items-center gap-1.5 font-semibold text-foreground bg-secondary/60 px-2 py-0.5 rounded-md border border-border/40">
                        {paymentMethod === "COD" ? (
                            <>
                                <Banknote className="w-3 h-3 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                                <span>Cash on Delivery</span>
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-3 h-3 text-primary" aria-hidden="true" />
                                <span>{paymentMethod === "RAZORPAY" ? "Razorpay Gateway" : "Credit / Debit Card"}</span>
                            </>
                        )}
                    </dd>
                </div>

                {/* Grand Total Row */}
                <div className="flex justify-between items-end pt-4 border-t border-border/80 text-base font-medium text-foreground">
                    <dt className="font-serif text-lg font-normal">Total Amount</dt>
                    <dd className="text-right" aria-live="polite" aria-atomic="true">
                        <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-foreground">
                            ₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </dd>
                </div>
            </dl>

            {/* Submit / Place Order CTA */}
            <div className="space-y-2 pt-2">
                <Button
                    type="button"
                    onClick={onCheckout}
                    disabled={isCheckoutDisabled}
                    className={cn(
                        "group w-full h-12 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all shadow-xs cursor-pointer",
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    {loading ? (
                        <span className="inline-flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                            <span>Processing Order…</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            <span>{buttonLabel}</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                        </span>
                    )}
                </Button>

                {/* Dynamic Validation Messaging */}
                {!selectedAddressId && items.length > 0 && (
                    <p
                        role="alert"
                        className="flex items-center justify-center gap-1.5 text-center text-[11px] text-amber-700 dark:text-amber-400 font-medium pt-1"
                    >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Please select a delivery address to complete your order.</span>
                    </p>
                )}

                {items.length === 0 && (
                    <p className="text-center text-[11px] text-muted-foreground font-light pt-1">
                        Your cart is currently empty.
                    </p>
                )}
            </div>

            {/* Security Guarantee Badge */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider pt-2 border-t border-border/30">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Bank-Grade Encrypted Checkout</span>
            </div>
        </aside>
    );
}