import { create } from "zustand";

type Product = {
    id: string;
    title: string;
    price: number;
    image: string;
};

type CartState = {
    items: Product[];
    addToCart: (product: Product) => void;
};

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addToCart: (product) =>
        set((state) => ({
            items: [...state.items, product],
        })),
}));
