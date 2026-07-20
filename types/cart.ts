import { ProductMedia } from "./product";

/** Guest cart (Zustand) */
export interface CartItem {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
}

/** Server cart (GraphQL) */
export interface ServerCartItem {
    quantity: number;

    product: {
        id: string;
        title: string;
        price: number;
        media: ProductMedia[];
    };
}

export interface Cart {
    items: ServerCartItem[];
}

export interface CartQueryResponse {
    cart: Cart | null;
}