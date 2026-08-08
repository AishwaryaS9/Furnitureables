import Link from "next/link";
import { PackageSearch, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function EmptyOrders() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": "Order History",
                        "description": "User purchase history and active order tracking directory.",
                        "numberOfItems": 0,
                        "itemListElement": [],
                    }),
                }}
            />

            <section
                aria-label="Empty order history notification"
                className="mx-auto flex min-h-[65vh] max-w-360 items-center justify-center px-4 py-8 sm:py-12 sm:px-6 lg:px-8"
            >
                <Card
                    role="region"
                    aria-label="Empty orders overview"
                    className={cn(
                        "relative w-full max-w-2xl overflow-hidden rounded-3xl border border-dashed border-border/80 bg-card transition-all duration-300 shadow-2xs",
                        "hover:border-border hover:bg-secondary/10"
                    )}
                >
                    <CardContent className="p-8 sm:p-12 lg:p-16 text-center">
                        {/* Ambient Radial Background Accent */}
                        <div
                            className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/5 blur-2xl"
                            aria-hidden="true"
                        />

                        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center">
                            {/* Visual Icon Container */}
                            <div
                                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-secondary border border-border/60 text-primary shadow-xs transition-transform duration-300 group-hover:scale-105"
                                aria-hidden="true"
                            >
                                <PackageSearch className="h-7 w-7 sm:h-8 sm:w-8 stroke-[1.75]" />
                            </div>

                            <h1 className="mt-5 text-xl sm:text-2xl font-serif font-normal tracking-tight text-foreground">
                                No Orders Placed Yet
                            </h1>

                            <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                                Your purchase archive is currently empty. Explore our latest architectural and furniture collections to initiate your first order.
                            </p>

                            <Button
                                // asChild
                                className={cn(
                                    "mt-6 sm:mt-8 h-11 px-6 text-xs sm:text-sm font-semibold tracking-wide uppercase rounded-xl transition-all shadow-xs cursor-pointer w-auto",
                                    "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
                                )}
                            >
                                <Link
                                    href="/products"
                                    aria-label="Explore products collection to place an order"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <ShoppingBag className="h-4 w-4 stroke-[2] shrink-0" aria-hidden="true" />
                                    <span>Explore Collection</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}