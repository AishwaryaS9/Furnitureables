"use client";

import { useFilterStore } from "@/store/useFilterStore";

export default function ProductFilters() {
  const { setFilter, resetFilters } = useFilterStore();

  return (
    <div className="flex flex-wrap gap-3 justify-center">

      {/* Category */}
      <select
        onChange={(e) => setFilter("category", e.target.value)}
        className="border rounded px-3 py-1"
      >
        <option value="">All Categories</option>
        <option value="chair">Chair</option>
        <option value="table">Table</option>
      </select>

      {/* Room */}
      <select
        onChange={(e) => setFilter("room", e.target.value)}
        className="border rounded px-3 py-1"
      >
        <option value="">All Rooms</option>
        <option value="living">Living Room</option>
        <option value="bedroom">Bedroom</option>
      </select>

      {/* Price */}
      <input
        type="number"
        placeholder="Min Price"
        onChange={(e) => setFilter("minPrice", Number(e.target.value))}
        className="border rounded px-2 py-1 w-24"
      />

      <input
        type="number"
        placeholder="Max Price"
        onChange={(e) => setFilter("maxPrice", Number(e.target.value))}
        className="border rounded px-2 py-1 w-24"
      />

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="px-3 py-1 bg-black text-white rounded"
      >
        Reset
      </button>
    </div>
  );
}