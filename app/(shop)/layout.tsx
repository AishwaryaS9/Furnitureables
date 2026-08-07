import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://furnitureables-store.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Furnitureables — Premium Handcrafted Furniture & Home Decor",
    template: "%s | Furnitureables",
  },
  description:
    "Explore sustainably engineered solid wood furniture designed for modern architectural living. Shop handcrafted sofas, dining tables, chairs, and home decor collections.",
  keywords: [
    "solid wood furniture",
    "handcrafted furniture",
    "modern home decor",
    "architectural furniture",
    "sustainable wooden tables",
    "luxury interior design",
  ],
  authors: [{ name: "Furnitureables" }],
  creator: "Furnitureables",
  publisher: "Furnitureables",
  alternates: {
    canonical: `${baseUrl}/shop`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${baseUrl}/shop`,
    siteName: "Furnitureables",
    title: "Furnitureables — Handcrafted Modern Solid Wood Furniture",
    description:
      "Sustainably engineered solid wood furniture designed for modern architectural living. Shop handcrafted tables, sofas, and interior collections.",
    images: [
      {
        url: `${baseUrl}/og-shop.jpg`,
        width: 1200,
        height: 630,
        alt: "Furnitureables Premium Solid Wood Furniture Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Furnitureables — Handcrafted Modern Solid Wood Furniture",
    description:
      "Sustainably engineered solid wood furniture designed for modern architectural living.",
    images: [`${baseUrl}/og-shop.jpg`],
    creator: "@furnitureables",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Furnitureables",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Premium handcrafted solid wood furniture engineered for modern living.",
    "sameAs": [
      "https://instagram.com/furnitureables",
      "https://pinterest.com/furnitureables",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Furnitureables",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${baseUrl}/shop`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationSchema,
            websiteSchema,
            breadcrumbSchema,
          ]),
        }}
      />

      <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
        {/* WCAG 2.2 Accessibility: Skip link for keyboard/screen reader navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-ring focus:ring-2"
        >
          Skip to main content
        </a>

        {/* Header & Navigation */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
          <Navbar />
        </header>

        {/* Main Semantic Content Node */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus:outline-none"
        >
          {children}
        </main>

        {/* Global Shop Footer */}
        <Footer />
      </div>
    </>
  );
}