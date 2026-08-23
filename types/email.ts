export interface InvoiceEmailItem {
    title: string;
    sku?: string | null;
    quantity: number;
    price: number;
}

export interface InvoiceEmailParams {
    customerName: string;
    orderNumber: string;
    createdAt: string;
    items: InvoiceEmailItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    couponCode?: string | null;
    total: number;
    currency: string;
    paymentMethod: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    shippingAddress: {
        addressLine1: string;
        addressLine2?: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    orderUrl: string;
    supportEmail: string;
    logoCid?: string;
}
