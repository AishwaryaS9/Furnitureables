import { beforeEach, describe, expect, it } from "vitest";
import { useFilterStore } from "@/store/useFilterStore";

const state = () => useFilterStore.getState();

beforeEach(() => {
    state().resetFilters();
});

describe("filter store", () => {
    it("starts with no filters on page 1", () => {
        expect(state().filters).toEqual({});
        expect(state().page).toBe(1);
    });

    it("sets a filter", () => {
        state().setFilter("category", "sofa");

        expect(state().filters).toEqual({ category: "sofa" });
    });

    it("keeps the other filters when one is set", () => {
        state().setFilter("category", "sofa");
        state().setFilter("minPrice", 500);

        expect(state().filters).toEqual({ category: "sofa", minPrice: 500 });
    });

    it("changes an existing filter", () => {
        state().setFilter("sortBy", "price_asc");
        state().setFilter("sortBy", "price_desc");

        expect(state().filters.sortBy).toBe("price_desc");
    });

    it("goes back to page 1 whenever a filter changes", () => {
        state().setPage(4);

        state().setFilter("room", "bedroom");

        expect(state().page).toBe(1);
    });

    it("changes the page without touching the filters", () => {
        state().setFilter("category", "sofa");

        state().setPage(3);

        expect(state().page).toBe(3);
        expect(state().filters).toEqual({ category: "sofa" });
    });

    it("resetFilters clears the filters and goes to page 1", () => {
        state().setFilter("category", "sofa");
        state().setPage(5);

        state().resetFilters();

        expect(state().filters).toEqual({});
        expect(state().page).toBe(1);
    });
});
