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
    addToCart: (product: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
    items: [],

    addToCart: (product) =>
        set((state) => {
            const existing = state.items.find((i) => i.id === product.id);
            // Default to 1 if a custom quantity wasn't provided
            const quantityToAdd = product.quantity ?? 1;

            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.id === product.id
                            ? { ...i, quantity: i.quantity + quantityToAdd } // Increment by chosen quantity
                            : i
                    ),
                };
            }

            // Destructure to separate quantity from the rest of the product properties
            const { quantity, ...productDetails } = product;

            return {
                items: [...state.items, { ...productDetails, quantity: quantityToAdd }],
            };
        }),

    removeFromCart: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),

    clearCart: () => set({ items: [] }),
}));