import type {
    RazorpayOptions,
    RazorpayInstance,
} from "@/types/razorpay";

declare global {
    interface Window {
        Razorpay: new (
            options: RazorpayOptions
        ) => RazorpayInstance;
    }
}

export { };