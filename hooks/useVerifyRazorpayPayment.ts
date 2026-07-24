import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { VERIFY_RAZORPAY_PAYMENT } from "@/lib/graphql/mutations";
import {
    VerifyRazorpayPaymentInput,
    VerifyRazorpayPaymentResponse,
} from "@/types/razorpay";

export function useVerifyRazorpayPayment() {
    return useMutation<
        VerifyRazorpayPaymentResponse,
        Error,
        VerifyRazorpayPaymentInput
    >({
        mutationFn: async (input) =>
            graphqlClient.request(
                VERIFY_RAZORPAY_PAYMENT,
                { input }
            ),
    });
}