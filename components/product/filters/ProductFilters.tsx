"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { ChevronDown, RotateCcw } from "lucide-react";

export default function ProductFilters() {
  const { setFilter, resetFilters } = useFilterStore();
  const filters = useFilterStore((s) => s.filters);

  const hasActiveFilters = Object.values(filters).some((val) => val !== undefined && val !== "");

  return (
    <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">

      {/* 1. CATEGORY DROPDOWN CONTAINER */}
      <div className="relative inline-block group">
        <select
          value={filters.category ?? ""}
          onChange={(e) => setFilter("category", e.target.value || undefined)}
          className="appearance-none bg-white text-xs font-medium tracking-wide text-zinc-700 pl-4 pr-10 py-2.5 border border-zinc-200 rounded-xl cursor-pointer outline-none hover:border-zinc-400 hover:text-zinc-950 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all min-w-35"
        >
          <option value="">All Categories</option>
          <option value="chair">Chairs</option>
          <option value="table">Tables</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-zinc-600 transition-colors" />
      </div>

      {/* 2. ROOM DROPDOWN CONTAINER */}
      <div className="relative inline-block group">
        <select
          value={filters.room ?? ""}
          onChange={(e) => setFilter("room", e.target.value || undefined)}
          className="appearance-none bg-white text-xs font-medium tracking-wide text-zinc-700 pl-4 pr-10 py-2.5 border border-zinc-200 rounded-xl cursor-pointer outline-none hover:border-zinc-400 hover:text-zinc-950 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all min-w-35"
        >
          <option value="">All Environments</option>
          <option value="living">Living Room</option>
          <option value="bedroom">The Bedroom</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-zinc-600 transition-colors" />
      </div>

      {/* 3. MIN PRICE COMPACT INPUT */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-[10px] font-medium tracking-widest text-zinc-400">$</span>
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice ?? ""}
          onChange={(e) =>
            setFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)
          }
          className="bg-white text-xs text-zinc-700 pl-6 pr-3 py-2.5 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all w-28 font-light placeholder:text-zinc-400"
        />
      </div>

      {/* 4. MAX PRICE COMPACT INPUT */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-[10px] font-medium tracking-widest text-zinc-400">$</span>
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            setFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)
          }
          className="bg-white text-xs text-zinc-700 pl-6 pr-3 py-2.5 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all w-28 font-light placeholder:text-zinc-400"
        />
      </div>

      {/* 5. MINIMALIST RESET TRIGGER */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold tracking-wider text-zinc-400 hover:text-zinc-900 active:scale-95 transition-all"
          title="Clear all active filters"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-2" />
          <span>RESET</span>
        </button>
      )}
    </div>
  );
}