import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { LegalSection } from "@/types/legal";

export const metadata: Metadata = {
    title: "Terms of Service | Furnitureables",
    description:
        "Read the terms and conditions that govern your use of the Furnitureables website, orders, and services.",
    openGraph: {
        title: "Terms of Service | Furnitureables",
        description: "Terms and conditions governing orders, deliveries, returns, and website usage.",
        type: "website",
    },
};

const sections: LegalSection[] = [
    {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: (
            <p>
                By accessing or using the Furnitureables website, creating an account, or
                placing an order, you agree to be bound by these Terms of Service. If you do
                not agree with any part of these terms, please do not use our site.
            </p>
        ),
    },
    {
        id: "eligibility",
        title: "2. Eligibility",
        content: (
            <p>
                You must be at least 18 years old, or the age of majority in your
                jurisdiction, to create an account or place an order. By using our services,
                you confirm that you meet this requirement.
            </p>
        ),
    },
    {
        id: "orders-pricing",
        title: "3. Orders & Pricing",
        content: (
            <>
                <ul>
                    <li>All prices are listed in the currency shown at checkout and are subject to change without notice.</li>
                    <li>We reserve the right to refuse or cancel any order, including in cases of pricing errors, suspected fraud, or stock unavailability.</li>
                    <li>An order is confirmed only once payment has been successfully processed and you receive a confirmation email.</li>
                    <li>Custom or made-to-order pieces may have extended production timelines, communicated at the time of purchase.</li>
                </ul>
            </>
        ),
    },
    {
        id: "payments",
        title: "4. Payments",
        content: (
            <p>
                Payments are processed securely through Stripe or Razorpay. By providing
                payment information, you represent that you are authorized to use the payment
                method and authorize us to charge the total order amount, including
                applicable taxes and shipping fees.
            </p>
        ),
    },
    {
        id: "shipping-delivery",
        title: "5. Shipping & Delivery",
        content: (
            <p>
                Estimated delivery timelines are provided at checkout and are not guaranteed.
                Furnitureables is not responsible for delays caused by third-party couriers,
                customs processing, or events beyond our reasonable control. Risk of loss
                passes to you upon delivery to the shipping address provided.
            </p>
        ),
    },
    {
        id: "returns",
        title: "6. Returns & Warranty",
        content: (
            <p>
                Most items are eligible for return within 30 days of delivery in original,
                unused condition. Custom-built pieces may be non-returnable unless defective.
                Structural components are covered under our warranty against manufacturing
                defects for the period stated on the product page. Contact our team to
                initiate a return or warranty claim.
            </p>
        ),
    },
    {
        id: "accounts",
        title: "7. User Accounts",
        content: (
            <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activity that occurs under your account. Notify us
                immediately if you suspect unauthorized access.
            </p>
        ),
    },
    {
        id: "intellectual-property",
        title: "8. Intellectual Property",
        content: (
            <p>
                All content on this site — including product photography, designs, text, and
                logos — is the property of Furnitureables or its licensors and is protected by
                applicable intellectual property laws. You may not reproduce, distribute, or
                create derivative works without our written permission.
            </p>
        ),
    },
    {
        id: "prohibited-use",
        title: "9. Prohibited Use",
        content: (
            <>
                <p>You agree not to:</p>
                <ul>
                    <li>Use the site for any unlawful purpose or in violation of these terms.</li>
                    <li>Attempt to gain unauthorized access to our systems or another user&rsquo;s account.</li>
                    <li>Interfere with the proper functioning of the website or its security features.</li>
                    <li>Scrape, resell, or republish product data without authorization.</li>
                </ul>
            </>
        ),
    },
    {
        id: "liability",
        title: "10. Limitation of Liability",
        content: (
            <p>
                To the fullest extent permitted by law, Furnitureables shall not be liable for
                any indirect, incidental, or consequential damages arising from your use of
                the site or products purchased through it. Our total liability for any claim
                shall not exceed the amount you paid for the relevant order.
            </p>
        ),
    },
    {
        id: "governing-law",
        title: "11. Governing Law",
        content: (
            <p>
                These Terms are governed by the laws of India, without regard to conflict of
                law principles. Any disputes arising from these terms shall be subject to the
                exclusive jurisdiction of the courts located in Udupi, Karnataka.
            </p>
        ),
    },
    {
        id: "changes",
        title: "12. Changes to These Terms",
        content: (
            <p>
                We may revise these Terms of Service at any time. Continued use of the site
                after changes are posted constitutes acceptance of the revised terms. The
                &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent
                revision.
            </p>
        ),
    },
    {
        id: "contact",
        title: "13. Contact Us",
        content: (
            <p>
                Questions about these Terms of Service can be sent to{" "}
                <a href="mailto:skudupi.aishwarya@gmail.com">skudupi.aishwarya@gmail.com</a>{" "}
                or via our <a href="/contact">Contact page</a>.
            </p>
        ),
    },
];

export default function TermsOfServicePage() {
    const termsSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms of Service",
        "description":
            "Read the terms and conditions that govern your use of the Furnitureables website, orders, and services.",
        "publisher": {
            "@type": "Organization",
            "name": "Furnitureables",
            "url": "https://furnitureables-store.vercel.app/",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
            />
            <LegalPageLayout
                eyebrow="Legal"
                title="Terms of Service"
                description="The terms and conditions that govern your use of the Furnitureables website and services."
                lastUpdated="August 21, 2026"
                sections={sections}
            />
        </>
    );
}