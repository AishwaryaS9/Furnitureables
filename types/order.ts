import { PaymentMethod } from "@/generated/prisma";

export interface PlaceOrderInput {
  addressId: string;
  paymentMethod: PaymentMethod;
}

export interface OrderItem {
  id: string;
  title: string;
  image?: string;
  sku?: string;
  price: number;
  quantity: number;

  product?: {
    id: string;
  };
}

export interface Order {
  id: string;

  orderNumber: string;

  status:
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

  paymentStatus:
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

  paymentMethod: PaymentMethod;

  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  fullName: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  postalCode: string;
  country: string;

  createdAt: string;

  items: OrderItem[];
}

export interface PlaceOrderResponse {
  placeOrder: Order;
}

export interface CancelOrderResponse {
  cancelOrder: Order;
}