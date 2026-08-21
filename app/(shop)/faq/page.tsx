import { Metadata } from "next";
import Link from "next/link";
import FaqContent from "@/components/faq/FaqContent";
import { FAQ_CATEGORIES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Furnitureables",
  description:
    "Answers to common questions about Furnitureables orders, shipping, solid timber materials, custom furniture, returns, and warranty.",
  openGraph: {
    title: "Frequently Asked Questions | Furnitureables",
    description:
      "Find answers to common questions about orders, solid wood care, custom commissions, shipping, and warranty.",
    type: "website",
  },
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CATEGORIES.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main
        id="main-content"
        tabIndex={-1}
        aria-labelledby="faq-page-heading"
        className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20 focus:outline-none"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Section */}
          <header className="text-center max-w-2xl mx-auto space-y-3">
            <span
              className="inline-block text-xs font-mono uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/50"
              aria-label="Section: Support Center"
            >
              Support Center
            </span>
            <h1
              id="faq-page-heading"
              className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-foreground"
            >
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
              Everything you need to know about orders, materials, shipping, and
              care. Can&rsquo;t find your answer? Our team is a message away.
            </p>
          </header>

          <FaqContent categories={FAQ_CATEGORIES} />

          {/* Contact Footnote */}
          <footer
            aria-label="Direct support assistance"
            className="max-w-2xl mx-auto text-center space-y-2 pt-4"
          >
            <p className="text-xs sm:text-sm text-muted-foreground font-light">
              Still have questions? We&rsquo;re happy to help.
            </p>
            <Link
              href="/contact"
              aria-label="Navigate to contact page to talk to our concierge team"
              className="inline-block text-xs font-medium px-4 py-2 rounded-full border border-border/60 bg-secondary/50 text-foreground hover:bg-secondary hover:border-border transition-colors cursor-pointer"
            >
              Contact Us
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}