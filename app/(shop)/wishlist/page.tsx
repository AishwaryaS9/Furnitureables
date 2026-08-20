import { Metadata } from "next";
import Link from "next/link";
import EmptyWishlist from "@/components/wishlist/EmptyWishlist";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import { graphqlServerClient } from "@/lib/graphql/server-client";
import { GET_WISHLIST } from "@/lib/graphql/queries";
import { WishlistResponse } from "@/types/wishlist";
import { auth } from "@clerk/nextjs/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, LogIn, ChevronLeft, ChevronRight } from "lucide-react";
import BreadcrumbNavigation from "@/components/common/BreadcrumbNavigation";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export const metadata: Metadata = {
  title: "Your Wishlist | Saved Architectural Furniture",
  description:
    "View and manage your saved solid wood furniture pieces and architectural design items.",
  robots: {
    index: false,
    follow: true,
  },
};

interface WishlistPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function WishlistPage({ searchParams }: WishlistPageProps) {
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

  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const client = await graphqlServerClient();
  const { wishlist } = await client.request<WishlistResponse>(GET_WISHLIST);

  // 2. Empty Wishlist State
  if (!wishlist || !wishlist.length) {
    return <EmptyWishlist />;
  }

  const totalItems = wishlist.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // Slicing for pagination
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedWishlist = wishlist.slice(startIndex, startIndex + PAGE_SIZE);

  // Schema.org Structured Data for ItemList
  const wishlistSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "My Saved Wishlist",
    "numberOfItems": totalItems,
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
                {totalItems} {totalItems === 1 ? "Saved Item" : "Saved Items"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-foreground leading-[1.1]">
              Saved Wishlist
            </h1>

            <p className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Your curated collection of solid wood pieces and architectural furniture saved for future reference.
            </p>
          </header>

          {/* Wishlist Grid Container */}
          <section
            aria-label="Wishlist items catalog"
            className="space-y-12"
          >
            <WishlistGrid wishlist={paginatedWishlist} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav
                aria-label="Wishlist pagination"
                className="flex items-center justify-center gap-3 pt-6 pb-2"
              >
                {/* Previous Button */}
                {currentPage > 1 ? (
                  <Link
                    href={`/wishlist?page=${currentPage - 1}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 gap-1.5 px-3.5 text-xs font-medium rounded-xl border-input bg-card shadow-xs text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">Previous</span>
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 gap-1.5 px-3.5 text-xs font-medium rounded-xl border-input bg-card shadow-xs text-foreground opacity-40 pointer-events-none"
                    )}
                  >
                    <ChevronLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">Previous</span>
                  </span>
                )}

                {/* Page Indicator */}
                <div
                  aria-current="page"
                  className="flex items-center justify-center min-w-22 h-9 px-3.5 text-xs font-medium text-muted-foreground bg-secondary/60 border border-border/60 rounded-xl shadow-xs select-none"
                >
                  <span className="text-foreground font-semibold">{currentPage}</span>
                  <span className="mx-1.5 text-muted-foreground/60">/</span>
                  <span>{totalPages}</span>
                </div>

                {/* Next Button */}
                {currentPage < totalPages ? (
                  <Link
                    href={`/wishlist?page=${currentPage + 1}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 gap-1.5 px-3.5 text-xs font-medium rounded-xl border-input bg-card shadow-xs text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    aria-label="Go to next page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 gap-1.5 px-3.5 text-xs font-medium rounded-xl border-input bg-card shadow-xs text-foreground opacity-40 pointer-events-none"
                    )}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </span>
                )}
              </nav>
            )}
          </section>
        </div>
      </main>
    </>
  );
}