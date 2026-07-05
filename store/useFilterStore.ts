import { create } from "zustand";

type Filters = {
  type?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};

type FilterStore = {
  filters: Filters;
  page: number;

  setFilters: (filters: Partial<Filters>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {},
  page: 1,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1,
    })),

  setPage: (page) => set({ page }),

  resetFilters: () =>
    set({
      filters: {},
      page: 1,
    }),
}));