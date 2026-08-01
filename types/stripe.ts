export interface StripeCheckoutSession {
    orderId: string;
    sessionId: string;
    checkoutUrl: string;
}