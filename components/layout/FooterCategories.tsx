"use client";

import Link from "next/link";
import { useProductCategories } from "@/hooks/useProductCategories";
import { formatCategoryLabel } from "@/lib/utils";

export default function FooterCategories() {
    const { data: topCategories = [], isLoading: categoriesLoading } = useProductCategories(5);

    return (
        <ul className="space-y-2 text-xs sm:text-sm">
            {categoriesLoading &&
                [...Array(4)].map((_, i) => (
                    <li key={i} aria-hidden="true">
                        <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                    </li>
                ))}

            {!categoriesLoading &&
                topCategories.map((cat) => (
                    <li key={cat.type}>
                        <Link
                            href={`/products?category=${encodeURIComponent(cat.type)}`}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {formatCategoryLabel(cat.type)}
                        </Link>
                    </li>
                ))}
        </ul>
    );
}
