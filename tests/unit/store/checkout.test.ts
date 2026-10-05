import { beforeEach, describe, expect, it } from "vitest";
import { useCheckoutStore } from "@/store/checkout";

beforeEach(() => {
    useCheckoutStore.getState().clearCheckout();
});

describe("checkout store", () => {
    it("starts with no address and cash on delivery", () => {
        const state = useCheckoutStore.getState();

        expect(state.selectedAddressId).toBe("");
        expect(state.paymentMethod).toBe("COD");
    });

    it("remembers the selected address", () => {
        useCheckoutStore.getState().setSelectedAddress("addr-1");

        expect(useCheckoutStore.getState().selectedAddressId).toBe("addr-1");
    });

    it("remembers the payment method", () => {
        useCheckoutStore.getState().setPaymentMethod("RAZORPAY");

        expect(useCheckoutStore.getState().paymentMethod).toBe("RAZORPAY");
    });

    it("clearCheckout goes back to the defaults", () => {
        useCheckoutStore.getState().setSelectedAddress("addr-1");
        useCheckoutStore.getState().setPaymentMethod("STRIPE");

        useCheckoutStore.getState().clearCheckout();

        expect(useCheckoutStore.getState().selectedAddressId).toBe("");
        expect(useCheckoutStore.getState().paymentMethod).toBe("COD");
    });
});
