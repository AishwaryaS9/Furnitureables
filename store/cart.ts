import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
};

type CartStore = {
    items: CartItem[];

    addToCart: (
        product: Omit<CartItem, "quantity"> & { quantity?: number }
    ) => void;

    removeFromCart: (id: string) => void;

    clearCart: () => void;

    setCart: (items: CartItem[]) => void;

    mergeCart: (items: CartItem[]) => void;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],

            addToCart: (product) =>
                set((state) => {
                    const quantityToAdd = product.quantity ?? 1;

                    const existing = state.items.find((i) => i.id === product.id);

                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? {
                                        ...item,
                                        quantity: item.quantity + quantityToAdd,
                                    }
                                    : item
                            ),
                        };
                    }

                    const { quantity, ...productDetails } = product;

                    return {
                        items: [
                            ...state.items,
                            {
                                ...productDetails,
                                quantity: quantityToAdd,
                            },
                        ],
                    };
                }),

            removeFromCart: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            clearCart: () => set({ items: [] }),

            setCart: (items) => set({ items }),

            mergeCart: (incomingItems) =>
                set((state) => {
                    const merged = [...state.items];

                    incomingItems.forEach((incoming) => {
                        const index = merged.findIndex((i) => i.id === incoming.id);

                        if (index !== -1) {
                            merged[index] = {
                                ...merged[index],
                                quantity: merged[index].quantity + incoming.quantity,
                            };
                        } else {
                            merged.push({ ...incoming });
                        }
                    });

                    return {
                        items: merged,
                    };
                }),
        }),
        {
            name: "guest-cart", // localStorage key
        }
    )
);