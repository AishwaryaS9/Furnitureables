import { CreditCard, Truck, Landmark, } from "lucide-react";
import { PaymentMethod } from "@/generated/prisma";

export const SORT_OPTIONS = [
    { value: "all", label: "Default" },
    { value: "latest", label: "Newest Additions" },
    { value: "priceAsc", label: "Price: Low → High" },
    { value: "priceDesc", label: "Price: High → Low" },
    { value: "nameAsc", label: "Name: A → Z" },
    { value: "nameDesc", label: "Name: Z → A" },
] as const;


export const METHODS: {
    id: PaymentMethod;
    title: string;
    description: string;
    icon: typeof Truck;
    badge?: string;
}[] = [
        {
            id: "COD",
            title: "Cash on Delivery",
            description: "Pay with cash or UPI when your architectural piece arrives.",
            icon: Truck,
        },
        {
            id: "RAZORPAY",
            title: "Razorpay Gateway",
            description: "Instant UPI, NetBanking, Debit/Credit Cards & Wallets (India)",
            icon: Landmark,
            badge: "Recommended in IN",
        },
        {
            id: "STRIPE",
            title: "Stripe Secure Cards",
            description: "International Credit / Debit Cards & Express Checkout",
            icon: CreditCard,
            badge: "Global",
        },
    ];