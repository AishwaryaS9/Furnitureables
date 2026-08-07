"use client";

import Link from "next/link";
import { Heart, ArrowRight, Bookmark, Sparkles, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyWishlist() {
    return (
        <section
            role="region"
            aria-label="Empty wishlist status"
            className="flex min-h-[65vh] items-center justify-center px-4 py-12 sm:py-16 text-foreground antialiased"
        >
            <div className="mx-auto max-w-lg text-center space-y-6">

                {/* Decorative Header Icon */}
                <div
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary border border-border/80 text-muted-foreground shadow-xs"
                    aria-hidden="true"
                >
                    <Heart className="h-9 w-9 stroke-[1.5]" />
                </div>

                {/* Heading & Subtitle */}
                <div className="space-y-2.5">
                    <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
                        Your wishlist is empty
                    </h1>

                    <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
                        Save your favorite solid wood pieces so you can easily reference them later. Start exploring our collections and save the items you love.
                    </p>
                </div>

                {/* Feature Highlights Grid */}
                <div
                    role="list"
                    aria-label="Wishlist benefits"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs font-medium text-muted-foreground"
                >
                    <div
                        role="listitem"
                        className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs shadow-xs"
                    >
                        <Bookmark className="w-4 h-4 text-foreground/80 mb-2" aria-hidden="true" />
                        <span>Save Favorites</span>
                    </div>

                    <div
                        role="listitem"
                        className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs shadow-xs"
                    >
                        <Scale className="w-4 h-4 text-foreground/80 mb-2" aria-hidden="true" />
                        <span>Compare Specs</span>
                    </div>

                    <div
                        role="listitem"
                        className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs shadow-xs"
                    >
                        <Sparkles className="w-4 h-4 text-foreground/80 mb-2" aria-hidden="true" />
                        <span>Shop Anytime</span>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                    <Button
                        // asChild
                        className="h-11 px-6 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                    >
                        <Link href="/products" className="inline-flex items-center gap-2 group">
                            <span>Browse Catalog</span>
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    );
}