import { create } from "zustand";

type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
};

type CartStore = {
    items: CartItem[];

    addToCart: (product: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
    items: [],

    addToCart: (product) =>
        set((state) => {
            const existing = state.items.find((i) => i.id === product.id);

            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.id === product.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                };
            }

            return {
                items: [...state.items, { ...product, quantity: 1 }],
            };
        }),

    removeFromCart: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),

    clearCart: () => set({ items: [] }),
}));