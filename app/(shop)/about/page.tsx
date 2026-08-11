import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Compass, ShieldCheck, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Furnitureables—our commitment to sustainable solid wood craftsmanship, timeless architectural design, and ethical manufacturing.",
};

const values = [
    {
        icon: TreePine,
        title: "Sustainably Harvested",
        description:
            "We source 100% of our timber from responsibly managed FSC-certified forests, ensuring zero deforestation.",
    },
    {
        icon: Compass,
        title: "Architectural Precision",
        description:
            "Every joint and grain alignment is calculated by master artisans to blur the line between furniture and structural art.",
    },
    {
        icon: ShieldCheck,
        title: "Built for Generations",
        description:
            "We reject throwaway culture. Our solid hardwood pieces are finished with non-toxic oils made to endure decades of daily living.",
    },
    {
        icon: Award,
        title: "Fair Artisanship",
        description:
            "We partner directly with woodworkers and craft communities, guaranteeing living wages and safe working environments.",
    },
];

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
            "logo": "https://www.furnitureables.com/logo.png",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
            />
            <main className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">

                    {/* Hero Section */}
                    <section className="text-center max-w-3xl mx-auto space-y-4">
                        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/50">
                            Our Heritage & Craft
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-foreground leading-tight">
                            Furniture engineered for living, crafted for time.
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
                            At Furnitureables, we believe home decor should be an investment in stability and craftsmanship. We create solid wood furniture that honors organic materials while elevating modern architecture.
                        </p>
                    </section>

                    {/* Core Values Grid */}
                    <section aria-labelledby="values-heading" className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2 id="values-heading" className="text-2xl sm:text-3xl font-serif font-normal tracking-tight">
                                Crafted With Purpose
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                The standards behind every piece in our collection.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((val) => {
                                const Icon = val.icon;
                                return (
                                    <Card key={val.title} className="rounded-2xl border-border/60 bg-card shadow-2xs">
                                        <CardContent className="p-6 space-y-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <Icon className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <h3 className="text-base font-semibold tracking-tight">{val.title}</h3>
                                            <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                                {val.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    {/* Story Narrative Section */}
                    <section className="rounded-3xl border border-border/60 bg-secondary/20 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">
                                From Raw Timber to Your Living Room
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                                Founded with a passion for architectural woodworking, Furnitureables began as a small studio workshop focused on custom joinery. Today, we bridge traditional woodworking with modern precision engineering.
                            </p>
                            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                                We select each piece of solid oak, walnut, and teak for its distinctive grain character, drying the timber slowly to prevent warping over generations.
                            </p>
                            <div className="pt-2">
                                <Button className="rounded-xl h-10 px-5 text-xs font-semibold cursor-pointer">
                                    <Link href="/products">
                                        <span>Explore Our Catalog</span>
                                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-border/60 bg-card p-6 text-center space-y-1">
                                <p className="text-3xl sm:text-4xl font-serif font-bold text-primary">15K+</p>
                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Homes Furnished</p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-card p-6 text-center space-y-1">
                                <p className="text-3xl sm:text-4xl font-serif font-bold text-primary">100%</p>
                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">FSC Hardwood</p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-card p-6 text-center space-y-1">
                                <p className="text-3xl sm:text-4xl font-serif font-bold text-primary">10 Yr</p>
                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Structural Warranty</p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-card p-6 text-center space-y-1">
                                <p className="text-3xl sm:text-4xl font-serif font-bold text-primary">4.9★</p>
                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Average Rating</p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </>
    );
}