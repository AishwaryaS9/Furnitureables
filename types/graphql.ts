import { Cart } from "./cart";
import { Order } from "./order";
import { Product } from "./product";

export interface OrdersResponse {
    orders: Order[];
}

export interface OrderResponse {
    order: Order;
}

export interface ProductResponse {
    product: Product | null;
}

export interface ProductList {
    items: Product[];
    total: number;
}

export interface ProductsResponse {
    products: ProductList;
}

export interface CartResponse {
    cart: Cart;
}