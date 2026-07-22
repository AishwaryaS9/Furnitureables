import { Cart } from "./cart";
import { Order } from "./order";
import { Product } from "./product";

export interface OrdersResponse {
    orders: Order[];
}

export interface OrderResponse {
    order: Order;
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