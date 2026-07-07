"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const { data, isLoading, isError } = useProducts();

  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="h-4 w-28 bg-muted animate-pulse rounded-full" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-4/5 w-full rounded-2xl bg-muted/70 animate-pulse" />
              <div className="space-y-2 px-1">
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive text-sm font-bold">
          !
        </div>
        <div className="space-y-1">
          <p className="text-foreground font-medium">Failed to load collections</p>
          <p className="text-xs text-muted-foreground">
            Our workshop is experiencing connectivity issues. Please reload or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!items.length){
    return (
      <div className="text-center py-24 max-w-md mx-auto space-y-2 border border-dashed border-border rounded-2xl bg-card/30">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          No matches found
        </p>
        <p className="text-xs text-muted-foreground/80 px-4">
          We couldn't find pieces matching your exact filter setup. Try clearing your selection or adjusting the criteria.
        </p>
      </div>
    );
}

return (
  <div className="space-y-6 max-w-7xl mx-auto">

    <div className="flex items-center justify-between border-b border-border/50 pb-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Showing {items.length} {items.length === 1 ? "Curated Piece" : "Curated Pieces"}
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both">
      {items.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);
}