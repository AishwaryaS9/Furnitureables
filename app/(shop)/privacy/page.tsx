import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { LegalSection } from "@/types/legal";

const sections: LegalSection[] = [
    {
        id: "overview",
        title: "1. Overview",
        content: (
            <p>
                Furnitureables (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects your privacy and is
                committed to protecting the personal information you share with us. This
                Privacy Policy explains what information we collect, how we use it, and the
                choices you have when you browse our catalog, place an order, or contact our
                team.
            </p>
        ),
    },
    {
        id: "information-we-collect",
        title: "2. Information We Collect",
        content: (
            <>
                <p>We collect information in the following ways:</p>
                <ul>
                    <li>
                        <strong className="text-foreground">Account details</strong> — name, email
                        address, and password when you create an account (via Clerk authentication).
                    </li>
                    <li>
                        <strong className="text-foreground">Order &amp; shipping information</strong>
                        {" "}— billing address, shipping address, and phone number needed to fulfill
                        an order.
                    </li>
                    <li>
                        <strong className="text-foreground">Payment information</strong> — processed
                        securely by Stripe or Razorpay; we never store full card numbers on our
                        servers.
                    </li>
                    <li>
                        <strong className="text-foreground">Communications</strong> — messages you
                        send through our contact form or newsletter signup.
                    </li>
                    <li>
                        <strong className="text-foreground">Usage data</strong> — pages visited,
                        products viewed, and cart activity, collected automatically to improve the
                        shopping experience.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "how-we-use-information",
        title: "3. How We Use Your Information",
        content: (
            <>
                <p>We use the information we collect to:</p>
                <ul>
                    <li>Process and fulfil orders, including payment, shipping, and returns.</li>
                    <li>Create and manage your account, wishlist, and order history.</li>
                    <li>Respond to enquiries submitted through our contact form.</li>
                    <li>Send newsletter updates when you opt in — you can unsubscribe anytime.</li>
                    <li>Improve our products, catalog, and website performance.</li>
                    <li>Detect and prevent fraud or unauthorized activity.</li>
                </ul>
            </>
        ),
    },
    {
        id: "sharing",
        title: "4. How We Share Information",
        content: (
            <>
                <p>
                    We do not sell your personal information. We only share it with trusted
                    third parties who help us operate the store:
                </p>
                <ul>
                    <li>
                        <strong className="text-foreground">Payment processors</strong> (Stripe,
                        Razorpay) to securely complete transactions.
                    </li>
                    <li>
                        <strong className="text-foreground">Authentication provider</strong> (Clerk)
                        to manage account sign-in.
                    </li>
                    <li>
                        <strong className="text-foreground">Form &amp; email delivery</strong>
                        {" "}(Web3Forms) to deliver contact form and newsletter submissions to our
                        team&apos;s inbox.
                    </li>
                    <li>Shipping and logistics partners to deliver your order.</li>
                    <li>Legal authorities, where required by law.</li>
                </ul>
            </>
        ),
    },
    {
        id: "cookies",
        title: "5. Cookies & Tracking",
        content: (
            <p>
                We use cookies and similar technologies to keep you signed in, remember your
                cart, and understand how our store is used. See our{" "}
                <a href="/cookies">Cookie Preferences</a> page for full details and how to
                manage your choices.
            </p>
        ),
    },
    {
        id: "data-retention",
        title: "6. Data Retention",
        content: (
            <p>
                We retain account and order information for as long as your account is active
                or as needed to comply with legal, tax, and accounting obligations. You may
                request deletion of your account data at any time by contacting us.
            </p>
        ),
    },
    {
        id: "your-rights",
        title: "7. Your Rights",
        content: (
            <>
                <p>Depending on your location, you may have the right to:</p>
                <ul>
                    <li>Access the personal information we hold about you.</li>
                    <li>Request correction of inaccurate information.</li>
                    <li>Request deletion of your account and associated data.</li>
                    <li>Opt out of marketing emails at any time.</li>
                </ul>
                <p>
                    To exercise any of these rights, please reach out through our{" "}
                    <a href="/contact">Contact page</a>.
                </p>
            </>
        ),
    },
    {
        id: "security",
        title: "8. Data Security",
        content: (
            <p>
                We use industry-standard safeguards — including encrypted connections and
                secure third-party payment processing — to protect your information. However,
                no method of transmission over the internet is 100% secure, and we cannot
                guarantee absolute security.
            </p>
        ),
    },
    {
        id: "children",
        title: "9. Children's Privacy",
        content: (
            <p>
                Our store is not directed at children under 13, and we do not knowingly
                collect personal information from children.
            </p>
        ),
    },
    {
        id: "changes",
        title: "10. Changes to This Policy",
        content: (
            <p>
                We may update this Privacy Policy from time to time. Changes will be posted on
                this page with an updated &ldquo;Last updated&rdquo; date. We encourage you to review
                this page periodically.
            </p>
        ),
    },
    {
        id: "contact",
        title: "11. Contact Us",
        content: (
            <p>
                If you have questions about this Privacy Policy or how we handle your
                information, email us at{" "}
                <a href="mailto:skudupi.aishwarya@gmail.com">skudupi.aishwarya@gmail.com</a>{" "}
                or visit our <a href="/contact">Contact page</a>.
            </p>
        ),
    },
];

export const metadata: Metadata = {
    title: "Privacy Policy | Furnitureables",
    description:
        "Learn how Furnitureables collects, uses, and protects your personal information across our store, checkout, and account features.",
    openGraph: {
        title: "Privacy Policy | Furnitureables",
        description: "Learn how we protect your personal information, orders, and payment data.",
        type: "website",
    },
};

export default function PrivacyPolicyPage() {
    const privacySchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Privacy Policy",
        "description":
            "Learn how Furnitureables collects, uses, and protects your personal information across our store, checkout, and account features.",
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
            />
            <LegalPageLayout
                eyebrow="Legal"
                title="Privacy Policy"
                description="How we collect, use, and protect your information when you shop with Furnitureables."
                lastUpdated="August 21, 2026"
                sections={sections}
            />
        </>
    );
}