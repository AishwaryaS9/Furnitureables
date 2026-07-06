"use client";

import { useFilterStore } from "@/store/useFilterStore";

export default function SearchBar() {
    const setFilter = useFilterStore((s) => s.setFilter);
    return (
        <input
            type="text"
            placeholder="Search furniture..."
            className="w-full max-w-md px-4 py-2 border rounded-lg"
            onChange={(e) => setFilter("search", e.target.value)}
        />
    );
}