"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductFilters() {
  const { setFilter, resetFilters } = useFilterStore();
  const filters = useFilterStore((s) => s.filters);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-5 w-full"
      aria-label="Product filters"
    >
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
            setFilter(
              "category",
              !val || val === "all" ? undefined : val
            )
          }
        >
          <SelectTrigger
            id="filter-category-trigger"
            aria-label="Filter by Category"
            className="w-full text-xs font-medium bg-card rounded-lg h-9 shadow-xs"
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent
            // position="popper"
            side="bottom"
            sideOffset={4}
            className="rounded-lg"
          >
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
            <SelectItem value="sofa" className="text-xs">Sofas</SelectItem>
            <SelectItem value="chair" className="text-xs">Chairs</SelectItem>
            <SelectItem value="table" className="text-xs">Tables</SelectItem>
            <SelectItem value="bed" className="text-xs">Beds</SelectItem>
            <SelectItem value="desk" className="text-xs">Desks</SelectItem>
            <SelectItem value="storage" className="text-xs">Storage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ENVIRONMENT / ROOM */}
      <div className="space-y-1.5">
        <label
          htmlFor="filter-room-trigger"
          className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase block"
        >
          Environment
        </label>
        <Select
          value={filters.room ?? "all"}
          onValueChange={(val) =>
            setFilter(
              "room",
              !val || val === "all" ? undefined : val
            )
          }
        >
          <SelectTrigger
            id="filter-room-trigger"
            aria-label="Filter by Environment"
            className="w-full text-xs font-medium bg-card rounded-lg h-9 shadow-xs"
          >
            <SelectValue placeholder="All Environments" />
          </SelectTrigger>
          <SelectContent
            // position="popper"
            side="bottom"
            sideOffset={4}
            className="rounded-lg"
          >
            <SelectItem value="all" className="text-xs">All Environments</SelectItem>
            <SelectItem value="living" className="text-xs">Living Room</SelectItem>
            <SelectItem value="bedroom" className="text-xs">Bedroom</SelectItem>
            <SelectItem value="office" className="text-xs">Office</SelectItem>
            <SelectItem value="study" className="text-xs">Study Room</SelectItem>
            <SelectItem value="dining" className="text-xs">Dining Room</SelectItem>
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