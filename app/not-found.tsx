import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, PackageSearch } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/product/filters/SearchBar";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or may have been moved.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
                <Navbar />
            </header>

            <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 focus:outline-none"
            >
                <section
                    aria-labelledby="not-found-heading"
                    className="relative overflow-hidden"
                >
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-linear-to-b from-secondary/60 via-background to-background"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
                    />

                    <div className="max-w-360 mx-auto px-5 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-36 flex flex-col items-center text-center">
                        {/* Eyebrow badge */}
                        <div
                            role="status"
                            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-md px-4 py-2"
                        >
                            <Compass size={14} className="text-primary" aria-hidden="true" />
                            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Lost in the showroom
                            </span>
                        </div>

                        <h1
                            id="not-found-heading"
                            className="mt-8 font-serif text-[6.5rem] sm:text-[9rem] lg:text-[11rem] leading-none tracking-tight text-foreground"
                        >
                            4<span className="italic font-light text-primary">0</span>4
                        </h1>

                        <p className="mt-4 max-w-xl text-lg sm:text-xl font-serif text-foreground">
                            This piece isn&apos;t in our collection.
                        </p>
                        <p className="mt-3 max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
                            The page you&apos;re looking for may have been moved, renamed, or
                            never existed. Let&apos;s get you back to browsing beautiful,
                            handcrafted furniture.
                        </p>

                        {/* Search */}
                        <div className="mt-10 w-full max-w-md">
                            <SearchBar className="w-full" />
                        </div>

                        {/* CTA actions */}
                        <nav
                            aria-label="Suggested navigation"
                            className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <Link
                                href="/"
                                aria-label="Return to the homepage"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <Home size={16} aria-hidden="true" />
                                Back to Home
                            </Link>
                            <Link
                                href="/products"
                                aria-label="Browse the full furniture catalog"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <PackageSearch size={16} aria-hidden="true" />
                                Browse Collection
                            </Link>
                        </nav>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
