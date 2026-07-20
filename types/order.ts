import { PaymentMethod } from "@/generated/prisma";

export interface PlaceOrderInput {
  addressId: string;
  paymentMethod: PaymentMethod;
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

  createdAt: string;
}

export interface PlaceOrderResponse {
  placeOrder: Order;
}