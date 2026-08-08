"use client";

import { MapPinPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyAddressProps {
    onAdd: () => void;
}

export default function EmptyAddress({ onAdd }: EmptyAddressProps) {
    return (
        <>
            {/* Schema.org JSON-LD to give search engine crawlers structural context */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": "Saved Delivery Destinations",
                        "description": "User saved address directory for expedited checkout.",
                        "numberOfItems": 0,
                        "itemListElement": [],
                    }),
                }}
            />

            <Card
                role="region"
                aria-label="Empty address directory notification"
                className={cn(
                    "relative overflow-hidden rounded-3xl border border-dashed border-border/80 bg-card transition-all duration-300 shadow-2xs",
                    "hover:border-border hover:bg-secondary/20"
                )}
            >
                <CardContent className="p-8 sm:p-12 lg:p-16 text-center">
                    {/* Ambient Radial Background Accent */}
                    <div
                        className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/5 blur-2xl"
                        aria-hidden="true"
                    />

                    <div className="relative z-10 mx-auto flex max-w-sm flex-col items-center">
                        {/* Visual Icon Container */}
                        <div
                            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-secondary border border-border/60 text-primary shadow-xs transition-transform duration-300 group-hover:scale-105"
                            aria-hidden="true"
                        >
                            <MapPinPlus className="h-7 w-7 sm:h-8 sm:w-8 stroke-[1.75]" />
                        </div>

                        <h3 className="mt-5 text-lg sm:text-xl font-serif font-normal tracking-tight text-foreground">
                            No Destinations Saved
                        </h3>

                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                            Your address directory is currently empty. Register your primary shipping or white-glove delivery destination for one-click express checkout.
                        </p>

                        <Button
                            type="button"
                            onClick={onAdd}
                            aria-label="Add a new delivery address"
                            className={cn(
                                "mt-6 sm:mt-8 h-10 px-5 text-xs font-semibold tracking-wide uppercase rounded-xl transition-all shadow-xs cursor-pointer w-full sm:w-auto",
                                "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
                            )}
                        >
                            <Plus className="mr-1.5 h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                            <span>Add First Address</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}