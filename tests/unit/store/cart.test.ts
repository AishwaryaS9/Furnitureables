import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/store/cart";

const chair = { id: "chair", title: "Chair", price: 100 };
const table = { id: "table", title: "Table", price: 300 };

const state = () => useCartStore.getState();

beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [], cartReady: false, syncedUserId: null });
});

describe("cart store", () => {
    describe("addToCart", () => {
        it("adds a new product with quantity 1 by default", () => {
            state().addToCart(chair);

            expect(state().items).toEqual([{ ...chair, quantity: 1 }]);
        });

        it("adds a new product with a given quantity", () => {
            state().addToCart({ ...chair, quantity: 4 });

            expect(state().items[0].quantity).toBe(4);
        });

        it("increases the quantity when the product is already in the cart", () => {
            state().addToCart(chair);
            state().addToCart({ ...chair, quantity: 2 });

            expect(state().items).toHaveLength(1);
            expect(state().items[0].quantity).toBe(3);
        });
    });

    describe("quantity changes", () => {
        beforeEach(() => {
            state().addToCart({ ...chair, quantity: 2 });
            state().addToCart(table);
        });

        it("incrementQuantity adds one", () => {
            state().incrementQuantity("chair");
            expect(state().items.find((i) => i.id === "chair")?.quantity).toBe(3);
        });

        it("decrementQuantity subtracts one", () => {
            state().decrementQuantity("chair");
            expect(state().items.find((i) => i.id === "chair")?.quantity).toBe(1);
        });

        it("decrementQuantity removes the item when it reaches zero", () => {
            state().decrementQuantity("table");
            expect(state().items.map((i) => i.id)).toEqual(["chair"]);
        });

        it("updateQuantity sets the quantity", () => {
            state().updateQuantity("chair", 7);
            expect(state().items.find((i) => i.id === "chair")?.quantity).toBe(7);
        });

        it("updateQuantity never goes below 1", () => {
            state().updateQuantity("chair", 0);
            state().updateQuantity("table", -5);

            expect(state().items.every((i) => i.quantity === 1)).toBe(true);
        });

        it("removeFromCart removes only that item", () => {
            state().removeFromCart("chair");
            expect(state().items.map((i) => i.id)).toEqual(["table"]);
        });
    });

    describe("resetting", () => {
        it("clearCart empties the cart and forgets the synced user", () => {
            state().addToCart(chair);
            state().setSyncedUserId("user_1");

            state().clearCart();

            expect(state().items).toEqual([]);
            expect(state().syncedUserId).toBeNull();
        });

        it("resetStore empties the cart, marks it ready and forgets the user", () => {
            state().addToCart(chair);
            state().setSyncedUserId("user_1");

            state().resetStore();

            expect(state().items).toEqual([]);
            expect(state().cartReady).toBe(true);
            expect(state().syncedUserId).toBeNull();
        });
    });

    describe("persistence", () => {
        it("saves items and syncedUserId, but not cartReady, to localStorage", () => {
            state().addToCart(chair);
            state().setSyncedUserId("user_1");
            state().setCartReady(true);

            const saved = JSON.parse(localStorage.getItem("guest-cart") ?? "{}");

            expect(saved.state.items).toHaveLength(1);
            expect(saved.state.syncedUserId).toBe("user_1");
            expect(saved.state).not.toHaveProperty("cartReady");
        });
    });
});
