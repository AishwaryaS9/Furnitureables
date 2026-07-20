import { create } from "zustand";
import { PaymentMethod } from "@/generated/prisma";

interface CheckoutStore {
    selectedAddressId: string;

    setSelectedAddress: (id: string) => void;

    paymentMethod: PaymentMethod;

    setPaymentMethod: (method: PaymentMethod) => void;

    clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
    selectedAddressId: "",

    paymentMethod: "COD",

    setSelectedAddress: (id) =>
        set({
            selectedAddressId: id,
        }),

    setPaymentMethod: (method) =>
        set({
            paymentMethod: method,
        }),

    clearCheckout: () =>
        set({
            selectedAddressId: "",
            paymentMethod: "COD",
        }),
}));