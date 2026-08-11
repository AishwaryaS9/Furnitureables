"use client";

import { X } from "lucide-react";
import { formatCategoryLabel } from "@/lib/utils";

type Props = {
    activeCategory?: string;
    onSelect: (type: string | undefined) => void;
};

export default function CategoryPills({ activeCategory, onSelect }: Props) {
    if (!activeCategory) return null;

    return (
        <div
            role="group"
            aria-label="Active category filter"
            className="flex flex-wrap items-center gap-2 pt-1"
        >
            <button
                type="button"
                onClick={() => onSelect(undefined)}
                aria-pressed="true"
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold bg-primary text-primary-foreground border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {formatCategoryLabel(activeCategory)}
                <X className="w-3 h-3" aria-hidden="true" />
                <span className="sr-only">Clear category filter</span>
            </button>
        </div>
    );
}