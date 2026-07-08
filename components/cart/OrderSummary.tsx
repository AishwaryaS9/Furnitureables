"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { ShieldCheck, Truck, Tag } from "lucide-react";

export default function OrderSummary() {
    const items = useCartStore((s) => s.items);
    const [couponCode, setCouponCode] = useState("");
    const [isApplied, setIsApplied] = useState(false);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingThreshold = 1500;
    const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 150;

    const discount = isApplied ? subtotal * 0.1 : 0;
    const estimatedTax = (subtotal - discount) * 0.08;
    const grandTotal = subtotal - discount + shippingCost + estimatedTax;

    const handleApplyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        if (couponCode.trim().toUpperCase() === "FURNISH10") {
            setIsApplied(true);
        } else {
            alert("Invalid design collective code. Try 'FURNISH10'");
        }
    };

    return (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6 sticky top-28">
            <h2 className="text-lg font-normal tracking-tight font-serif text-zinc-900">Order Summary</h2>

            {/* Free Delivery Banner */}
            {subtotal > 0 && subtotal < shippingThreshold && (
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3.5 space-y-2">
                    <p className="text-xs font-light text-zinc-600 flex items-center gap-2">
                        <Truck size={14} className="text-zinc-400 shrink-0" />
                        Add <span className="font-medium text-zinc-950">${(shippingThreshold - subtotal).toLocaleString()}</span> more for <span className="font-medium text-zinc-950">Free White Glove Delivery</span>
                    </p>
                    <div className="w-full bg-zinc-200 h-1 rounded-full overflow-hidden">
                        <div
                            className="bg-zinc-900 h-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* PREMIUM COUPON ENTRY PANEL */}
            <div className="border-t border-b border-zinc-100 py-4">
                {!isApplied ? (
                    <form onSubmit={handleApplyPromo} className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold block pl-1">
                            Have an Furnisheables Code?
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Enter code (e.g. FURNISH10)"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="w-full bg-zinc-50/50 text-xs border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all font-light tracking-wide uppercase placeholder:normal-case"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!couponCode.trim()}
                                className="bg-zinc-900 text-white disabled:bg-zinc-100 disabled:text-zinc-400 text-xs font-medium px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-all cursor-pointer disabled:cursor-not-allowed"
                            >
                                Apply
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-800 tracking-wider font-mono">FURNISH10 APPLIED</span>
                        </div>
                        <button
                            onClick={() => { setIsApplied(false); setCouponCode(""); }}
                            className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider cursor-pointer pl-2"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>

            {/* Ledger Breakdown Fields */}
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-zinc-500 font-light">
                    <span>Subtotal</span>
                    <span className="font-medium text-zinc-900 tabular-nums">${subtotal.toLocaleString()}</span>
                </div>

                {isApplied && (
                    <div className="flex justify-between items-center text-emerald-600 font-light animate-in fade-in duration-200">
                        <span>Furnisheables Collective Discount (10%)</span>
                        <span className="font-semibold tabular-nums">-${discount.toLocaleString()}</span>
                    </div>
                )}

                <div className="flex justify-between items-center text-zinc-500 font-light pt-1 border-t border-zinc-100/60">
                    <span>White Glove Shipping</span>
                    <span className="font-medium text-zinc-900 tabular-nums">
                        {shippingCost === 0 ? (
                            <span className="text-emerald-600 text-xs uppercase tracking-wider font-semibold">Free</span>
                        ) : (
                            `$${shippingCost.toLocaleString()}`
                        )}
                    </span>
                </div>

                <div className="flex justify-between items-center text-zinc-500 font-light pt-1 border-t border-zinc-100/60">
                    <span>Estimated Sales Tax</span>
                    <span className="font-medium text-zinc-900 tabular-nums">${estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-zinc-100 text-base font-medium text-zinc-950">
                    <span className="font-serif font-normal">Total</span>
                    <div className="text-right">
                        <span className="text-xl font-bold tracking-tight font-sans tabular-nums">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            <button
                disabled={items.length === 0}
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 font-semibold text-xs uppercase tracking-widest py-4 rounded-xl shadow-xs active:scale-[0.99] transition-all cursor-pointer disabled:cursor-not-allowed"
            >
                Proceed to Secure Checkout
            </button>

            {/* Security Check */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium tracking-wide uppercase pt-2">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Secured SSL Checkout Protocols</span>
            </div>
        </div>
    );
}