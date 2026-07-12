import { ProductMedia } from "./product";

export type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
};

export type CartQueryResponse = {
    cart: {
        items: {
            id: string;
            quantity: number;
            product: {
                id: string;
                title: string;
                price: number;
                media: ProductMedia[];
            };
        }[];
    };
};