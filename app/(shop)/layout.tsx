import { Metadata } from "next";
import { Suspense } from "react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoogleAnalyticsPageTracker from "@/components/analytics/GoogleAnalyticsPageTracker";
import { GA_MEASUREMENT_ID } from "@/lib/analytics/gtag";
import { getAnonymousPromotion, getTopCategories } from "@/lib/data/cached";

// Shop pages are cached and refreshed in the background (pages that use
// request-time APIs remain dynamic).
export const revalidate = 300;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

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
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Furnitureables",
    title: "Furnitureables — Handcrafted Modern Solid Wood Furniture",
    description:
      "Sustainably engineered solid wood furniture designed for modern architectural living. Shop handcrafted tables, sofas, and interior collections.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
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
    images: [`${baseUrl}/og-image.jpg`],
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

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-render data every shop page needs (navbar promo bar, navbar and
  // footer category links). Without this the promo bar is injected after a
  // client fetch and pushes the whole page down (CLS), and the footer/nav show
  // skeletons until the GraphQL round trip completes.
  const queryClient = new QueryClient();
  const [promotion, categories] = await Promise.allSettled([
    getAnonymousPromotion(),
    getTopCategories(),
  ]);

  if (promotion.status === "fulfilled") {
    queryClient.setQueryData(["activePromotion"], promotion.value);
  }
  if (categories.status === "fulfilled") {
    queryClient.setQueryData(["productCategories", 5], categories.value);
  }

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
        "item": `${baseUrl}/products`,
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

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
            <Navbar />
          </header>

          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 focus:outline-none"
          >
            {children}
          </main>

          <Footer />
        </div>
      </HydrationBoundary>

      {GA_MEASUREMENT_ID && (
        <>
          <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
          <Suspense fallback={null}>
            <GoogleAnalyticsPageTracker />
          </Suspense>
        </>
      )}
    </>
  );
}