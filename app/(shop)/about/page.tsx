import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroFurniture from "@/public/images/hero-sofa.webp";
import { ABOUT_VALUES, ABOUT_PROCESS, ABOUT_STATS, ABOUT_TESTIMONIALS } from "@/lib/data";

export const metadata: Metadata = {
    title: "About Us | Sustainable Solid Wood Craftsmanship",
    description:
        "Learn about Furnitureables—our commitment to sustainable solid wood craftsmanship, timeless architectural design, and ethical manufacturing.",
    openGraph: {
        title: "About Furnitureables | Crafted for Living, Built for Generations",
        description:
            "Learn about our sustainable solid wood craftsmanship, timeless architectural design, and ethical manufacturing.",
        type: "website",
    },
};

export default function AboutPage() {
    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Furnitureables",
        "description":
            "Learn about Furnitureables' commitment to sustainable solid wood craftsmanship and architectural design.",
        "publisher": {
            "@type": "Organization",
            "name": "Furnitureables",
            "url": "https://furnitureables-store.vercel.app/",
            "logo": "https://furnitureables-store.vercel.app/logo.png",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Artisan Way, Kadiyali",
                "addressLocality": "Udupi",
                "addressRegion": "Karnataka",
                "postalCode": "576101",
                "addressCountry": "IN",
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
            />
            <main
                id="main-content"
                tabIndex={-1}
                aria-labelledby="about-page-heading"
                className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20 focus:outline-none"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">

                    {/* Hero Section */}
                    <header className="text-center max-w-3xl mx-auto space-y-4">
                        <span
                            className="inline-block text-xs font-mono uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/50"
                            aria-label="Section: Our Heritage and Craft"
                        >
                            Our Heritage & Craft
                        </span>
                        <h1
                            id="about-page-heading"
                            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-foreground leading-tight"
                        >
                            Furniture engineered for living, crafted for time.
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
                            At Furnitureables, we believe home decor should be an investment in stability and craftsmanship. We create solid wood furniture that honors organic materials while elevating modern architecture.
                        </p>
                    </header>

                    {/* Hero Image Banner */}
                    <section aria-label="Visual showcase of Furnitureables craftsmanship">
                        <div className="relative h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-sm">
                            <Image
                                src={heroFurniture}
                                alt="Handcrafted solid timber furniture in a modern minimalist interior"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                                className="object-cover object-center"
                            />
                            <div
                                className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent"
                                aria-hidden="true"
                            />
                            <div className="absolute bottom-0 left-0 p-6 sm:p-10">
                                <p className="text-background/90 font-serif text-xl sm:text-2xl lg:text-3xl max-w-md leading-snug">
                                    Every piece starts as a single, hand-selected board.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Core Values Grid */}
                    <section aria-labelledby="values-heading" className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2
                                id="values-heading"
                                className="text-2xl sm:text-3xl font-serif font-normal tracking-tight"
                            >
                                Crafted With Purpose
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                The standards behind every piece in our collection.
                            </p>
                        </div>

                        <ul
                            role="list"
                            aria-label="Core craftsmanship values"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0"
                        >
                            {ABOUT_VALUES.map((val) => {
                                const Icon = val.icon;
                                return (
                                    <li key={val.title} className="h-full">
                                        <Card className="rounded-2xl border-border/60 bg-card shadow-2xs h-full">
                                            <CardContent className="p-6 space-y-3">
                                                <div
                                                    className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
                                                    aria-hidden="true"
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-base font-semibold tracking-tight">
                                                    {val.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                                    {val.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>

                    {/* Story Narrative Section */}
                    <section
                        aria-labelledby="story-heading"
                        className="rounded-3xl border border-border/60 bg-secondary/20 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
                    >
                        <div className="space-y-4">
                            <h2
                                id="story-heading"
                                className="text-3xl sm:text-4xl font-serif font-normal tracking-tight"
                            >
                                From Raw Timber to Your Living Room
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                                Founded with a passion for architectural woodworking, Furnitureables began as a small studio workshop focused on custom joinery. Today, we bridge traditional woodworking with modern precision engineering.
                            </p>
                            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                                We select each piece of solid oak, walnut, and teak for its distinctive grain character, drying the timber slowly to prevent warping over generations.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/products"
                                    aria-label="Explore our full architectural furniture catalog"
                                    className="group inline-flex items-center gap-2 text-xs font-semibold text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors cursor-pointer"
                                >
                                    <span>Explore Our Catalog</span>
                                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>

                        {/* Performance Statistics */}
                        <ul
                            role="list"
                            aria-label="Company metrics and milestones"
                            className="grid grid-cols-2 gap-4 list-none p-0 m-0"
                        >
                            {ABOUT_STATS.map((stat) => (
                                <li
                                    key={stat.label}
                                    className="rounded-2xl border border-border/60 bg-card p-6 text-center space-y-1"
                                    aria-label={stat.ariaLabel}
                                >
                                    <p
                                        className="text-3xl sm:text-4xl font-serif font-bold text-primary"
                                        aria-hidden="true"
                                    >
                                        {stat.value}
                                    </p>
                                    <p
                                        className="text-xs text-muted-foreground font-mono uppercase tracking-wider"
                                        aria-hidden="true"
                                    >
                                        {stat.label}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Process Timeline */}
                    <section aria-labelledby="process-heading" className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2
                                id="process-heading"
                                className="text-2xl sm:text-3xl font-serif font-normal tracking-tight"
                            >
                                From Forest to Floor
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Four stages, every piece, every time.
                            </p>
                        </div>

                        <ol
                            aria-label="Crafting process stages"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative list-none p-0 m-0"
                        >
                            {ABOUT_PROCESS.map((step, i) => {
                                const Icon = step.icon;
                                return (
                                    <li key={step.title} className="relative space-y-3">
                                        {i < ABOUT_PROCESS.length - 1 && (
                                            <div
                                                className="hidden lg:block absolute top-6 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <div
                                            className="relative z-10 mx-auto lg:mx-0 h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-serif text-sm shadow-sm"
                                            aria-hidden="true"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="text-center lg:text-left space-y-1">
                                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                                Step {step.step}
                                            </p>
                                            <h3 className="text-base font-semibold tracking-tight">
                                                {step.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </section>

                    {/* Testimonials */}
                    <section aria-labelledby="testimonials-heading" className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2
                                id="testimonials-heading"
                                className="text-2xl sm:text-3xl font-serif font-normal tracking-tight"
                            >
                                Trusted in Hundreds of Homes
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                A few words from people living with our furniture every day.
                            </p>
                        </div>

                        <ul
                            role="list"
                            aria-label="Customer testimonials"
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0"
                        >
                            {ABOUT_TESTIMONIALS.map((t) => (
                                <li key={t.name} className="h-full">
                                    <Card className="rounded-2xl border-border/60 bg-card shadow-2xs h-full">
                                        <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                                            <figure className="space-y-4 m-0">
                                                <Quote
                                                    className="h-5 w-5 text-primary/60"
                                                    aria-hidden="true"
                                                />
                                                <blockquote className="m-0">
                                                    <p className="text-sm text-foreground/90 font-light leading-relaxed">
                                                        &ldquo;{t.quote}&rdquo;
                                                    </p>
                                                </blockquote>
                                                <figcaption className="pt-2 border-t border-border/40">
                                                    <p className="text-xs font-semibold text-foreground">
                                                        {t.name}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                                        {t.role}
                                                    </p>
                                                </figcaption>
                                            </figure>
                                        </CardContent>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Closing CTA */}
                    <section
                        aria-labelledby="cta-heading"
                        className="rounded-3xl bg-foreground text-background p-10 sm:p-14 text-center space-y-5"
                    >
                        <h2
                            id="cta-heading"
                            className="text-2xl sm:text-3xl font-serif font-normal tracking-tight"
                        >
                            Ready to furnish your space with something built to last?
                        </h2>
                        <p className="text-sm text-background/70 max-w-xl mx-auto font-light leading-relaxed">
                            Browse the full catalog or reach out to our team for a custom commission.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <Button
                                className="rounded-xl h-10 px-6 text-xs font-semibold cursor-pointer bg-background text-foreground hover:bg-background/90"
                            >
                                <Link
                                    href="/products"
                                    aria-label="Explore our collection of solid timber furniture"
                                    className="flex items-center"
                                >
                                    <span>Explore Our Catalog</span>
                                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl h-10 px-6 text-xs font-semibold cursor-pointer border-background/30 text-background hover:bg-background/10 hover:text-background bg-transparent"
                            >
                                <Link
                                    href="/contact"
                                    aria-label="Contact our team for inquiries and custom commissions"
                                >
                                    <span>Talk to Our Team</span>
                                </Link>
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}