import { create } from "zustand";

type Filters = {
  category?: string;
  room?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
};

type FilterStore = {
  filters: Filters;
  page: number;

  setFilter: <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => void;

  setPage: (page: number) => void;

  resetFilters: () => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {},
  page: 1,

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
      page: 1,
    })),

  setPage: (page) => set({ page }),

  resetFilters: () =>
    set({
      filters: {},
      page: 1,
    }),
}));