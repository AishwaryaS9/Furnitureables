"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductGrid() {
  const { data, isLoading, isError } = useProducts();

  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <div
        className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">Loading products…</span>
        <Skeleton className="h-4 w-36 rounded-lg" aria-hidden="true" />

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 mt-8"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4 group">
              <Skeleton className="aspect-4/5 w-full rounded-2xl border border-border/20" />
              <div className="space-y-3 px-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3.5 w-1/4 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="text-center py-24 max-w-md mx-auto space-y-5 border border-border bg-card/50 rounded-3xl p-8 shadow-xs"
        role="alert"
        aria-live="assertive"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive shadow-2xs">
          <AlertCircle className="w-5 h-5 stroke-[1.75]" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Failed to load collections
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Our digital workshop is having connectivity problems. Try refreshing or drop back by shortly.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border-border rounded-xl hover:bg-primary hover:text-primary-foreground transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" aria-hidden="true" />
          Reload Studio
        </Button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div
        className="text-center py-28 max-w-md mx-auto space-y-4 border border-dashed border-border rounded-3xl bg-card shadow-xs p-10"
        role="status"
        aria-live="polite"
      >
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground mx-auto border border-border shadow-2xs">
          <Sparkles className="w-5 h-5 stroke-[1.25]" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            No matches found
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-light px-2">
            We couldn't track down pieces matching your exact filter parameters. Clear your current criteria to browse the full catalog layout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10" aria-labelledby="product-grid-heading">
      <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
        <h2 id="product-grid-heading" className="sr-only">
          Product results
        </h2>
        <span
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono"
          role="status"
          aria-live="polite"
        >
          Showing {items.length} {items.length === 1 ? "Curated Piece" : "Curated Pieces"}
        </span>
      </div>

      <ul
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 list-none animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both ease-out motion-reduce:animate-none"
      >
        {items.map((product) => (
          <li
            key={product.id}
            className="transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.04)] focus-within:-translate-y-1.5 focus-within:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.04)] rounded-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}