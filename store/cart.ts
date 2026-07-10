import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
}

type CartStore = {
    items: CartItem[];

    addToCart: (
        product: Omit<CartItem, "quantity"> & { quantity?: number }
    ) => void;

    removeFromCart: (id: string) => void;

    clearCart: () => void;

    setCart: (items: CartItem[]) => void;

    cartReady: boolean;

    setCartReady: (ready: boolean) => void;

};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            cartReady: false,
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

            clearCart: () => set({
                items: [],
            }),

            setCart: (items) => set({ items }),

            setCartReady: (ready) =>
                set({
                    cartReady: ready,
                }),
        }),
        {
            name: "guest-cart",
        }
    )
);