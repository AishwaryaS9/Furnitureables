"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { ChevronDown, RotateCcw } from "lucide-react";

export default function ProductFilters() {
  const { setFilter, resetFilters } = useFilterStore();

  const filters = useFilterStore((s) => s.filters);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <div className="flex flex-wrap gap-3 items-center">

      {/* CATEGORY */}
      <div className="relative group">

        <select
          value={filters.category ?? ""}
          onChange={(e) =>
            setFilter(
              "category",
              e.target.value || undefined
            )
          }
          className="appearance-none bg-white border border-zinc-200 rounded-xl px-4 py-2.5 pr-10 text-xs min-w-40"
        >
          <option value="">All Categories</option>

          <option value="sofa">Sofas</option>
          <option value="chair">Chairs</option>
          <option value="table">Tables</option>
          <option value="bed">Beds</option>
          <option value="desk">Desks</option>
          <option value="storage">Storage</option>

        </select>

        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" />

      </div>

      {/* ROOM */}

      <div className="relative group">

        <select
          value={filters.room ?? ""}
          onChange={(e) =>
            setFilter(
              "room",
              e.target.value || undefined
            )
          }
          className="appearance-none bg-white border border-zinc-200 rounded-xl px-4 py-2.5 pr-10 text-xs min-w-40"
        >
          <option value="">All Environments</option>

          <option value="living">Living Room</option>

          <option value="bedroom">Bedroom</option>

          <option value="office">Office</option>

          <option value="study">Study Room</option>

          <option value="dining">Dining Room</option>

        </select>

        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" />

      </div>

      {/* SORT */}

      <div className="relative group">

        <select
          value={filters.sortBy ?? ""}
          onChange={(e) =>
            setFilter(
              "sortBy",
              e.target.value || undefined
            )
          }
          className="appearance-none bg-white border border-zinc-200 rounded-xl px-4 py-2.5 pr-10 text-xs min-w-44"
        >
          <option value="">Sort By</option>

          <option value="latest">
            Latest
          </option>

          <option value="priceAsc">
            Price: Low → High
          </option>

          <option value="priceDesc">
            Price: High → Low
          </option>

          <option value="nameAsc">
            Name: A → Z
          </option>

          <option value="nameDesc">
            Name: Z → A
          </option>

        </select>

        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" />

      </div>

      {/* MIN PRICE */}

      <input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice ?? ""}
        onChange={(e) =>
          setFilter(
            "minPrice",
            e.target.value
              ? Number(e.target.value)
              : undefined
          )
        }
        className="border border-zinc-200 rounded-xl px-4 py-2.5 text-xs w-28"
      />

      {/* MAX PRICE */}

      <input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice ?? ""}
        onChange={(e) =>
          setFilter(
            "maxPrice",
            e.target.value
              ? Number(e.target.value)
              : undefined
          )
        }
        className="border border-zinc-200 rounded-xl px-4 py-2.5 text-xs w-28"
      />

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-2 px-3 py-2.5 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />

          RESET

        </button>
      )}

    </div>
  );
}