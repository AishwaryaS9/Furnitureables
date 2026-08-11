"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { useProductCategories } from "@/hooks/useProductCategories";
import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/data";

export default function ProductFilters() {
  const { setFilter, resetFilters } = useFilterStore();
  const filters = useFilterStore((s) => s.filters);

  const { data: categories, isLoading: categoriesLoading } = useProductCategories(20);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-5 w-full"
      aria-label="Product filters"
    >

      {/* SORT BY */}
      <div className="space-y-1.5">
        <label
          htmlFor="filter-category-trigger"
          className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase block"
        >
          Sort By
        </label>
        <div className="w-auto min-w-37.5 sm:min-w-45">
          <Select
            value={filters.sortBy ?? "all"}
            onValueChange={(val) =>
              setFilter("sortBy", !val || val === "all" ? undefined : val)
            }
          >
            <SelectTrigger
              id="sort-select-trigger"
              aria-label="Sort products catalog"
              className="w-full text-xs font-medium bg-card rounded-lg h-9 shadow-xs"
            >
              <SelectValue placeholder="(Default)">
                {SORT_OPTIONS.find((opt) => opt.value === (filters.sortBy ?? "all"))?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={4}
              align="end"
              className="rounded-lg"
            >
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* CATEGORY */}
      <div className="space-y-1.5">
        <label
          htmlFor="filter-category-trigger"
          className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase block"
        >
          Category
        </label>
        <Select
          value={filters.category ?? "all"}
          onValueChange={(val) =>
            setFilter("category", !val || val === "all" ? undefined : val)
          }
        >
          <SelectTrigger
            id="filter-category-trigger"
            aria-label="Filter by Category"
            className="w-full text-xs font-medium bg-card rounded-lg h-9 shadow-xs"
          >
            <SelectValue placeholder="All Categories" className="capitalize" />
          </SelectTrigger>
          <SelectContent side="bottom" sideOffset={4} className="rounded-lg">
            <SelectItem value="all" className="text-xs">
              All Categories
            </SelectItem>
            {categoriesLoading && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                Loading…
              </div>
            )}
            {categories?.map((c) => (
              <SelectItem key={c.type} value={c.type} className="text-xs capitalize">
                {c.type} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* PRICE RANGE */}
      <fieldset className="space-y-1.5 border-none p-0 m-0">
        <legend className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase block mb-1">
          Price Range ($)
        </legend>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="filter-min-price" className="sr-only">
              Minimum Price
            </label>
            <Input
              id="filter-min-price"
              type="number"
              min="0"
              placeholder="Min"
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                setFilter(
                  "minPrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="bg-card text-xs font-medium rounded-lg h-9 shadow-xs placeholder:text-muted-foreground/70"
            />
          </div>

          <div>
            <label htmlFor="filter-max-price" className="sr-only">
              Maximum Price
            </label>
            <Input
              id="filter-max-price"
              type="number"
              min="0"
              placeholder="Max"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                setFilter(
                  "maxPrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="bg-card text-xs font-medium rounded-lg h-9 shadow-xs placeholder:text-muted-foreground/70"
            />
          </div>
        </div>
      </fieldset>

      {/* RESET BUTTON */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={resetFilters}
          className="w-full justify-center gap-2 my-4 text-xs font-semibold rounded-lg h-9 text-muted-foreground hover:text-foreground border-border bg-secondary/50 hover:bg-secondary transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Filters</span>
        </Button>
      )}
    </form>
  );
}