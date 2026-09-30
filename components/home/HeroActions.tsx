"use client";

import Link from "next/link";
import { event as trackEvent } from "@/lib/analytics/gtag";

/**
 * The only interactive part of the hero. Kept as a tiny client component so
 * the rest of the hero (heading, copy, image) is plain server-rendered HTML
 * that paints immediately, with no JS or animation library in the way.
 */
export default function HeroActions() {
    return (
        <nav
            aria-label="Hero quick navigation"
            className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
            <Link
                href="/products"
                onClick={() =>
                    trackEvent("select_content", {
                        content_type: "hero_cta",
                        item_id: "explore_collection",
                    })
                }
                className="flex justify-center rounded-xl bg-primary-foreground px-8 py-4 text-sm font-semibold text-primary transition-all hover:scale-[1.03] hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                Explore Collection
            </Link>
            <Link
                href="/about"
                onClick={() =>
                    trackEvent("select_content", {
                        content_type: "hero_cta",
                        item_id: "our_design_ethos",
                    })
                }
                className="flex justify-center rounded-xl border border-primary-foreground/40 bg-primary-foreground/10 backdrop-blur-md px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                Our Design Ethos
            </Link>
        </nav>
    );
}
