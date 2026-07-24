import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import { CREATE_RAZORPAY_ORDER } from "@/lib/graphql/mutations";
import { CreateRazorpayOrderInput, CreateRazorpayOrderResponse } from "@/types/razorpay";

export function useCreateRazorpayOrder() {
    return useMutation<
        CreateRazorpayOrderResponse,
        Error,
        CreateRazorpayOrderInput
    >({
        mutationFn: async (input) =>
            graphqlClient.request<CreateRazorpayOrderResponse>(
                CREATE_RAZORPAY_ORDER,
                { input }
            ),
    });
}