"use client";

import ProductCard from "./ProductCard";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { Button } from "@/components/ui/button";

interface RelatedProductsProps {
    type: string;
    id: string;
}

export default function RelatedProducts({ type, id }: RelatedProductsProps) {
    const { data, isLoading } = useRelatedProducts({
        type,
        id,
    });

    // Skeleton Loading State
    if (isLoading) {
        return (
            <div
                role="status"
                aria-label="Loading related products"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
                <span className="sr-only">Loading related products...</span>
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="space-y-4 animate-pulse rounded-2xl border border-border/50 p-3 bg-card">
                        <div className="aspect-square w-full rounded-xl bg-muted" />
                        <div className="space-y-2 px-1">
                            <div className="h-4 bg-muted rounded-md w-2/3" />
                            <div className="h-3.5 bg-muted rounded-md w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty State (No related items found)
    if (!data || data.length === 0) {
        return (
            <div
                role="region"
                aria-label="No related products found"
                className="w-full rounded-3xl border border-dashed border-border bg-card/50 backdrop-blur-xs p-6 sm:p-10 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-xs"
            >
                <div
                    className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground mb-3 border border-border shadow-xs"
                    aria-hidden="true"
                >
                    <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight">Unique Item</h3>
                <p className="text-xs text-muted-foreground font-light max-w-xs mt-1 mb-5 leading-relaxed">
                    This item is part of an exclusive collection, but you can find more amazing alternatives in our main catalog.
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    // asChild
                    className="rounded-xl text-xs font-semibold h-9 px-4 border-border bg-card hover:bg-secondary text-foreground transition-all"
                >
                    <Link href="/products" className="inline-flex items-center gap-2 group">
                        <span>Explore all furniture</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
                    </Link>
                </Button>
            </div>
        );
    }

    // Product Showcase Feed
    return (
        <div
            role="region"
            aria-label="Related products feed"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
            {data.map((p) => (
                <div key={p.id} className="transition-transform duration-300 hover:-translate-y-1 focus-within:-translate-y-1 rounded-2xl">
                    <ProductCard product={p} />
                </div>
            ))}
        </div>
    );
}