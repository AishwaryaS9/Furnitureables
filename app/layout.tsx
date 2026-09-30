import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/common/ScrollToTop";
import DeferredClientEffects from "@/components/providers/DeferredClientEffects";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfairDisplay",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBFB" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Furnitureables — Premium Handcrafted Furniture & Home Decor",
    template: "%s | Furnitureables",
  },
  description:
    "Discover timeless, modern handcrafted furniture and luxury home accessories designed for comfort, durability, and style.",
  keywords: [
    "furniture",
    "home decor",
    "modern furniture",
    "luxury interior",
    "handcrafted wood furniture",
    "living room design",
  ],
  authors: [{ name: "Furnitureables Team" }],
  creator: "Furnitureables",
  publisher: "Furnitureables",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://furnitureables-store.vercel.app/",
    title: "Furnitureables — Premium Handcrafted Furniture & Home Decor",
    description:
      "Transform your space with timeless, modern furniture crafted for lifestyle and elegance.",
    siteName: "Furnitureables",
  },
  twitter: {
    card: "summary_large_image",
    title: "Furnitureables — Premium Handcrafted Furniture & Home Decor",
    description:
      "Transform your space with timeless, modern furniture crafted for lifestyle and elegance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // prefetchUI={false}: don't preload Clerk's large UI bundle on every page.
  // It is still fetched on demand when a sign-in / user component is used.
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      prefetchUI={false}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`${playfairDisplay.variable} ${montserrat.variable} h-full scroll-smooth antialiased`}
      >
        <body className="min-h-full bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Skip to main content
          </a>

          <QueryProvider>
            <ScrollToTop />
            <DeferredClientEffects />
            {children}
            <Toaster position="top-right" richColors closeButton />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}