import { Metadata } from "next";
import Link from "next/link";

import CookiePreferencesPanel from "@/components/legal/CookiePreferencesPanel";
import { LegalSection } from "@/types/legal";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
    title: "Cookie Preferences",
    description:
        "Manage which cookies Furnitureables can use on your device — essential, functional, analytics, and marketing.",
    openGraph: {
        title: "Cookie Preferences | Furnitureables",
        description: "Manage your cookie preferences and learn how we protect your browsing data.",
        type: "website",
    },
};

const sections: LegalSection[] = [
    {
        id: "manage-preferences",
        title: "Manage Your Preferences",
        content: (
            <div className="space-y-4">
                <p>
                    Choose which categories of cookies you&rsquo;re comfortable with. Essential
                    cookies are always on since the store can&rsquo;t function without them.
                    Your choice is saved on this device and applies the next time you visit.
                </p>
                <CookiePreferencesPanel />
            </div>
        ),
    },
    {
        id: "what-are-cookies",
        title: "What Are Cookies?",
        content: (
            <p>
                Cookies are small text files stored on your device when you visit a website.
                They help the site remember your preferences, keep you signed in, and
                understand how the site is used so we can improve it over time.
            </p>
        ),
    },
    {
        id: "categories",
        title: "Cookie Categories We Use",
        content: (
            <ul className="space-y-1.5 list-disc pl-5">
                <li>
                    <strong className="text-foreground">Essential</strong> — sign-in sessions
                    (Clerk), shopping cart contents, and checkout security. Always active.
                </li>
                <li>
                    <strong className="text-foreground">Functional</strong> — remembers wishlist
                    items, recently viewed products, and display preferences.
                </li>
                <li>
                    <strong className="text-foreground">Analytics</strong> — helps us understand
                    traffic patterns and popular products in aggregate, anonymized form.
                </li>
                <li>
                    <strong className="text-foreground">Marketing</strong> — used to personalize
                    promotions and measure ad performance across other sites, only if enabled.
                </li>
            </ul>
        ),
    },
    {
        id: "third-party",
        title: "Third-Party Cookies",
        content: (
            <p>
                Some cookies are set by services we rely on to run the store, including our
                payment processors (Stripe, Razorpay) and authentication provider (Clerk).
                These partners may set their own cookies subject to their respective privacy
                policies.
            </p>
        ),
    },
    {
        id: "browser-controls",
        title: "Managing Cookies via Your Browser",
        content: (
            <p>
                In addition to the controls above, most browsers let you block or delete
                cookies through their settings menu. Note that blocking essential cookies may
                prevent you from signing in or completing checkout.
            </p>
        ),
    },
    {
        id: "changes",
        title: "Changes to This Policy",
        content: (
            <p>
                We may update our cookie practices as our site evolves. Any changes will be
                reflected on this page along with an updated &ldquo;Last updated&rdquo; date.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact Us",
        content: (
            <p>
                Questions about our use of cookies? Email{" "}
                <a
                    href="mailto:skudupi.aishwarya@gmail.com"
                    aria-label="Send email to skudupi.aishwarya@gmail.com"
                    className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                    skudupi.aishwarya@gmail.com
                </a>{" "}
                or visit our{" "}
                <Link
                    href="/contact"
                    aria-label="Navigate to the contact page"
                    className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                    Contact page
                </Link>
                .
            </p>
        ),
    },
];

export default function CookiePreferencesPage() {
    const cookiePolicySchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Cookie Preferences & Policy",
        "description": "Control which cookies Furnitureables can use on your device.",
        "publisher": {
            "@type": "Organization",
            "name": "Furnitureables",
            "url": "https://furnitureables-store.vercel.app",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(cookiePolicySchema) }}
            />
            <LegalPageLayout
                eyebrow="Legal"
                title="Cookie Preferences"
                description="Control which cookies Furnitureables can use on your device."
                lastUpdated="August 21, 2026"
                sections={sections}
            />
        </>
    );
}