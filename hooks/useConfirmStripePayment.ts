import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { CONFIRM_STRIPE_PAYMENT } from "@/lib/graphql/mutations";

export function useConfirmStripePayment() {
    return useMutation({
        mutationFn: (input: { orderId: string; paymentIntentId: string }) =>
            graphqlClient.request(CONFIRM_STRIPE_PAYMENT, input),
    });
}
