import { PaymentMethod } from "@/generated/prisma";

export interface PlaceOrderInput {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponId?: string;
}

export interface AdminOrderItem {
  id: string;
  productName: string;
  productImage?: string | null;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatusFilter;
  paymentStatus: PaymentStatusFilter;
  paymentMethod: PaymentMethod;
  total: number;
  itemsCount: number;
  currency: string;
  createdAt: string;
  items?: AdminOrderItem[];
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

export type OrderStatusFilter =
  | "ALL"
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatusFilter =
  | "ALL"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatusFilter;
  paymentStatus: PaymentStatusFilter;
  paymentMethod: PaymentMethod;
  coupon?: {
    code: string;
  } | null;

  razorpayPaymentId?: string | null;

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

export interface BuyAgainResponse {
  buyAgain: {
    id: string;
  };
}