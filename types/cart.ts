import { ProductMedia } from "./product";

export type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
};

export interface CartQueryResponse {
    cart: {
        items: {
            quantity: number;
            product: {
                id: string;
                title: string;
                price: number;
                media: ProductMedia[];
            };
        }[];
    } | null;
}

