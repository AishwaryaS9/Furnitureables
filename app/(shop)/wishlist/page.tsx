import { Metadata } from "next";
import Link from "next/link";
import EmptyWishlist from "@/components/wishlist/EmptyWishlist";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import { graphqlServerClient } from "@/lib/graphql/server-client";
import { GET_WISHLIST } from "@/lib/graphql/queries";
import { WishlistResponse } from "@/types/wishlist";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, LogIn } from "lucide-react";
import BreadcrumbNavigation from "@/components/common/BreadcrumbNavigation";

export const metadata: Metadata = {
  title: "Your Wishlist | Saved Architectural Furniture",
  description: "View and manage your saved solid wood furniture pieces and architectural design items.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function WishlistPage() {
  const { userId } = await auth();

  // 1. Unauthenticated User State
  if (!userId) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-background text-foreground antialiased"
      >
        <Card className="max-w-md w-full border-border/80 bg-card/60 backdrop-blur-xs p-6 sm:p-8 text-center shadow-xs rounded-2xl">
          <CardContent className="p-0 space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border shadow-xs">
              <LogIn className="w-6 h-6 stroke-[1.5]" aria-hidden="true" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl font-serif font-medium tracking-tight text-foreground">
                Sign in to view your wishlist
              </h1>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Save your favorite solid wood pieces and access them across all your devices.
              </p>
            </div>

            <Button
              // asChild
              className="w-full h-11 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
            >
              <Link href="/sign-in" className="inline-flex items-center justify-center gap-2">
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign In to Continue</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const client = await graphqlServerClient();

  const { wishlist } = await client.request<WishlistResponse>(GET_WISHLIST);

  // 2. Empty Wishlist State
  if (!wishlist || !wishlist.length) {
    return <EmptyWishlist />;
  }

  // Schema.org Structured Data for ItemList
  const wishlistSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "My Saved Wishlist",
    "numberOfItems": wishlist.length,
  };

  // 3. Authenticated Active Wishlist State
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wishlistSchema) }}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background transition-colors duration-200"
      >
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation value="Wishlist" />

          {/* Header Section */}
          <header className="max-w-3xl mb-10 sm:mb-12 space-y-3">
            <div
              className="inline-flex items-center gap-2 bg-secondary/80 border border-border/60 rounded-full px-3.5 py-1.5 backdrop-blur-md shadow-xs"
              role="status"
              aria-live="polite"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" aria-hidden="true" />
              <span className="text-xs font-medium text-foreground/80 tracking-tight">
                {wishlist.length} {wishlist.length === 1 ? "Saved Item" : "Saved Items"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-foreground leading-[1.1]">
              Saved Wishlist
            </h1>

            {/* <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-xl"> */}
            <p className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Your curated collection of solid wood pieces and architectural furniture saved for future reference.
            </p>
          </header>

          {/* Wishlist Grid Container */}
          <section
            aria-label="Wishlist items catalog"
            className="space-y-12"
          >
            <WishlistGrid wishlist={wishlist} />
          </section>

        </div>
      </main >
    </>
  );
}