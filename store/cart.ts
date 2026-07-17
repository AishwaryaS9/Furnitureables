import { CartItem } from "@/types/cart";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
    items: CartItem[];

    addToCart: (
        product: Omit<CartItem, "quantity"> & { quantity?: number }
    ) => void;

    incrementQuantity: (id: string) => void;

    decrementQuantity: (id: string) => void;

    updateQuantity: (id: string, quantity: number) => void;

    removeFromCart: (id: string) => void;

    clearCart: () => void;

    setCart: (items: CartItem[]) => void;

    cartReady: boolean;
    setCartReady: (ready: boolean) => void;
    syncedUserId: string | null;
    setSyncedUserId: (id: string | null) => void;
};


export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            cartReady: false,
            syncedUserId: null,
            setSyncedUserId: (id) => set({ syncedUserId: id }),
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

            incrementQuantity: (id) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                quantity: item.quantity + 1,
                            }
                            : item
                    ),
                })),

            decrementQuantity: (id) =>
                set((state) => ({
                    items: state.items
                        .map((item) =>
                            item.id === id
                                ? {
                                    ...item,
                                    quantity: item.quantity - 1,
                                }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                quantity: Math.max(1, quantity),
                            }
                            : item
                    ),
                })),

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
            partialize: (state) => ({
                items: state.items,
                syncedUserId: state.syncedUserId,
            }),

        }
    )
);

