"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { ShieldCheck, Truck, Tag, Loader2, ArrowRight } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCouponStore } from "@/store/coupon";
import { useValidateCoupon } from "@/hooks/useValidateCoupon";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CartSummary() {
    const { user } = useUser();
    const { openSignIn } = useClerk();

    const items = useCartStore((s) => s.items);

    const router = useRouter();

    const [couponCode, setCouponCode] = useState("");
    const coupon = useCouponStore((s) => s.coupon);
    const setCoupon = useCouponStore((s) => s.setCoupon);
    const clearCoupon = useCouponStore((s) => s.clearCoupon);

    const validateCoupon = useValidateCoupon();

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const shippingThreshold = 1500;

    const shippingCost =
        subtotal >= shippingThreshold || subtotal === 0
            ? 0
            : 150;

    const discount = coupon?.discount ?? 0;

    const taxableAmount = Math.max(subtotal - discount, 0);

    const estimatedTax = taxableAmount * 0.08;

    const grandTotal =
        taxableAmount +
        shippingCost +
        estimatedTax;

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!couponCode.trim()) return;

        try {
            const result = await validateCoupon.mutateAsync({
                code: couponCode.trim().toUpperCase(),
                subtotal,
            });

            const response = result.validateCoupon;

            if (!response.success || !response.coupon) {
                toast.error(response.message);
                return;
            }

            setCoupon({
                id: response.coupon.id,
                code: response.coupon.code,
                discount: response.discount,
            });

            toast.success(response.message);
        } catch {
            toast.error("Failed to validate coupon.");
        }
    };

    const handleRemoveCoupon = () => {
        clearCoupon();
        setCouponCode("");
        toast.success("Coupon removed.");
    };

    const handleCheckout = () => {
        if (!user) {
            openSignIn();
            return;
        }
        router.push("/checkout");
    };

    const progressPercentage = Math.min((subtotal / shippingThreshold) * 100, 100);

    return (
        <aside
            aria-label="Order summary ledger"
            className="bg-card border border-border/80 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6 sticky top-28 backdrop-blur-xs text-card-foreground"
        >
            <h2 className="text-xl font-serif font-normal tracking-tight text-foreground">
                Order Summary
            </h2>

            {/* Free Delivery Banner Progress */}
            {subtotal > 0 && subtotal < shippingThreshold && (
                <div className="bg-secondary/50 border border-border/60 rounded-2xl p-4 space-y-2.5">
                    <p className="text-xs font-light text-muted-foreground flex items-center gap-2">
                        <Truck className="w-4 h-4 text-foreground/70 shrink-0" aria-hidden="true" />
                        <span>
                            Add <strong className="font-semibold text-foreground">${(shippingThreshold - subtotal).toLocaleString()}</strong> more for <strong className="font-semibold text-foreground">Free White Glove Delivery</strong>
                        </span>
                    </p>
                    <div
                        role="progressbar"
                        aria-valuenow={progressPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Free delivery eligibility progress"
                        className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden"
                    >
                        <div
                            className="bg-primary h-full transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Coupon Entry Panel */}
            <div className="border-t border-b border-border/60 py-4">
                {!coupon ? (
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                        <label
                            htmlFor="coupon-input"
                            className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold block pl-1"
                        >
                            Have a Promo Code?
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Tag className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                                <Input
                                    id="coupon-input"
                                    type="text"
                                    placeholder="Enter code (e.g. FURNISH10)"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="w-full h-10 bg-secondary/30 text-xs border-input rounded-xl pl-9 pr-3 uppercase placeholder:normal-case focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={!couponCode.trim() || validateCoupon.isPending}
                                className="h-10 px-4 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer disabled:cursor-not-allowed"
                            >
                                {validateCoupon.isPending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                                ) : (
                                    "Apply"
                                )}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 tracking-wider font-mono">
                                {coupon?.code} APPLIED
                            </span>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveCoupon}
                            className="h-7 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-transparent uppercase tracking-wider p-0 cursor-pointer"
                        >
                            Remove
                        </Button>
                    </div>
                )}
            </div>

            {/* Ledger Breakdown Fields */}
            <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-muted-foreground font-light">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground tabular-nums">${subtotal.toLocaleString()}</span>
                </div>

                {coupon && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-light">
                        <span>Coupon ({coupon?.code})</span>
                        <span className="font-semibold tabular-nums">-${discount.toLocaleString()}</span>
                    </div>
                )}

                <div className="flex justify-between items-center text-muted-foreground font-light pt-2 border-t border-border/40">
                    <span>White Glove Shipping</span>
                    <span className="font-semibold text-foreground tabular-nums">
                        {shippingCost === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider font-semibold">Free</span>
                        ) : (
                            `$${shippingCost.toLocaleString()}`
                        )}
                    </span>
                </div>

                <div className="flex justify-between items-center text-muted-foreground font-light pt-2 border-t border-border/40">
                    <span>Estimated Sales Tax</span>
                    <span className="font-semibold text-foreground tabular-nums">
                        ${estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-border/80 text-base font-medium text-foreground">
                    <span className="font-serif font-normal text-lg">Total</span>
                    <div className="text-right">
                        <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-foreground">
                            ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            <Button
                disabled={items.length === 0}
                onClick={handleCheckout}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs uppercase tracking-widest rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span>{user ? "Proceed to Secure Checkout" : "Login to Checkout"}</span>
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>

            {/* Security Check */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-semibold tracking-widest uppercase pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>Secured SSL Checkout Protocols</span>
            </div>
        </aside>
    );
}