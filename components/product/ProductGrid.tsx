"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { AlertCircle, Sparkles, RefreshCw } from "lucide-react";

export default function ProductGrid() {
  const { data, isLoading, isError } = useProducts();

  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20">
        <div className="h-4 w-36 bg-zinc-100 rounded-lg animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4 group">
              <div className="aspect-4/5 w-full rounded-2xl bg-linear-to-br from-zinc-100 to-zinc-50/50 animate-pulse border border-zinc-200/20" />
              <div className="space-y-3 px-1">
                <div className="h-4 w-3/4 bg-zinc-100 rounded-md animate-pulse" />
                <div className="h-3.5 w-1/4 bg-zinc-50 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-24 max-w-md mx-auto space-y-5 border border-zinc-100 bg-zinc-50/30 rounded-3xl p-8 shadow-xs">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 shadow-2xs">
          <AlertCircle className="w-5 h-5 stroke-[1.75]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-zinc-950 tracking-tight">Failed to load collections</h3>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
            Our digital workshop is having connectivity problems. Try refreshing or drop back by shortly.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-zinc-200 rounded-xl hover:bg-zinc-900 hover:text-white transition-all shadow-2xs"
        >
          <RefreshCw className="w-3 h-3" />
          Reload Studio
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-28 max-w-md mx-auto space-y-4 border border-dashed border-zinc-200 rounded-3xl bg-white shadow-xs p-10">
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 mx-auto border border-zinc-100 shadow-2xs">
          <Sparkles className="w-5 h-5 stroke-[1.25]" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-800">
            No matches found
          </h3>
          <p className="text-xs text-zinc-500/90 leading-relaxed font-light px-2">
            We couldn't track down pieces matching your exact filter parameters. Clear your current criteria to browse the full catalog layout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10">
      <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 font-mono">
          Showing {items.length} {items.length === 1 ? "Curated Piece" : "Curated Pieces"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both ease-out">
        {items.map((product: any) => (
          <div
            key={product.id}
            className="transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.04)] rounded-2xl"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}