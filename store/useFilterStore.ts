import { create } from "zustand";

type Filters = {
    category?: string;
    material?: string;
    color?: string;
    room?: string;
    minPrice?: number;
    maxPrice?: number;
};

type FilterStore = {
    filters: Filters;
    setFilter: (key: keyof Filters, value: any) => void;
    resetFilters: () => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
    filters: {},

    setFilter: (key, value) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [key]: value,
            },
        })),

    resetFilters: () => set({ filters: {} }),
}));