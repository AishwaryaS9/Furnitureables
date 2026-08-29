"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FaqContentProps } from "@/types/faq";

export default function FaqContent({ categories }: FaqContentProps) {
    const [query, setQuery] = useState("");

    const filteredCategories = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return categories;

        return categories
            .map((category) => ({
                ...category,
                items: category.items.filter(
                    (item) =>
                        item.question.toLowerCase().includes(q) ||
                        item.answer.toLowerCase().includes(q)
                ),
            }))
            .filter((category) => category.items.length > 0);
    }, [categories, query]);

    const totalResults = filteredCategories.reduce(
        (sum, cat) => sum + cat.items.length,
        0
    );

    return (
        <section aria-label="Frequently asked questions directory" className="space-y-10">
            {/* Search Input Landmark */}
            <form
                role="search"
                aria-label="Search FAQs"
                onSubmit={(e) => e.preventDefault()}
                className="max-w-xl mx-auto relative"
            >
                <label htmlFor="faq-search-input" className="sr-only">
                    Search frequently asked questions
                </label>
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                    aria-hidden="true"
                />
                <input
                    id="faq-search-input"
                    type="search"
                    name="faqSearch"
                    autoComplete="off"
                    spellCheck={false}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search questions — e.g. shipping, returns, warranty..."
                    className="w-full h-11 pl-11 pr-10 text-sm bg-card border border-border/60 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                />
                {query && (
                    <div className="absolute inset-y-0 right-1.5 flex items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setQuery("")}
                            className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            aria-label="Clear FAQ search query"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </div>
                )}
            </form>

            {/* Live Polling Status */}
            {query && (
                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="text-center text-xs text-muted-foreground font-medium -mt-6"
                >
                    {totalResults === 0
                        ? `No questions found for "${query}"`
                        : `Showing ${totalResults} ${totalResults === 1 ? "result" : "results"} for "${query}"`}
                </div>
            )}

            {/* Categories & Accordions */}
            <div className="space-y-10">
                {filteredCategories.map((category) => (
                    <section
                        key={category.id}
                        aria-labelledby={`faq-category-${category.id}`}
                        className="space-y-4"
                    >
                        <h2
                            id={`faq-category-${category.id}`}
                            className="text-lg sm:text-xl font-serif font-normal tracking-tight text-foreground"
                        >
                            {category.title}
                        </h2>
                        <div className="rounded-2xl border border-border/60 bg-card px-5 sm:px-6 shadow-2xs">
                            <Accordion>
                                {category.items.map((item) => (
                                    <AccordionItem
                                        key={item.question}
                                        value={item.question}
                                        className="border-b border-border/40 last:border-b-0"
                                    >
                                        <AccordionTrigger
                                            className="text-sm font-medium text-foreground hover:no-underline py-4 text-left cursor-pointer"
                                            aria-label={`Toggle answer for: ${item.question}`}
                                        >
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-4">
                                            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </section>
                ))}

                {/* Empty State */}
                {filteredCategories.length === 0 && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="text-center py-12 space-y-3"
                    >
                        <p className="text-sm text-muted-foreground">
                            We couldn&rsquo;t find a match. Try a different search term, or reach
                            out directly.
                        </p>
                        <Link
                            href="/contact"
                            aria-label="Go to the contact page to speak with support"
                            className="inline-block text-xs font-medium px-4 py-2 rounded-full border border-border/60 bg-secondary/50 text-foreground hover:bg-secondary hover:border-border transition-colors cursor-pointer"
                        >
                            Contact Us
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}