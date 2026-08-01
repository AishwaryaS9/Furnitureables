import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { CREATE_STRIPE_PAYMENT_INTENT } from "@/lib/graphql/mutations";

export function useCreateStripePaymentIntent() {
    return useMutation({
        mutationFn: (input: {
            addressId: string;
            paymentMethod: "STRIPE";
            couponId?: string;
        }) =>
            graphqlClient.request(
                CREATE_STRIPE_PAYMENT_INTENT,
                {
                    input,
                }
            ),
    });
}