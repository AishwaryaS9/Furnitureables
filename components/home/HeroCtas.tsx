"use client";

import Link from "next/link";
import { event as trackEvent } from "@/lib/analytics/gtag";

export default function HeroCtas() {
    return (
        <nav
            aria-label="Hero quick navigation"
            className="hero-in mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            style={{ animationDelay: "0.3s" }}
        >
            <Link
                href="/products"
                aria-label="Explore the full furniture collection"
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
                aria-label="Learn about our design ethos and craftsmanship"
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
