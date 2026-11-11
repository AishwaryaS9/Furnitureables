import { PaymentMethod } from "@/generated/prisma";
import { LucideIcon } from "lucide-react";

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

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type OrderStatusFilter = "ALL" | OrderStatus;
export type PaymentStatusFilter = "ALL" | PaymentStatus;

export interface Order {
  id: string;
  orderNumber: string;
  // status: OrderStatusFilter;
  // paymentStatus: PaymentStatusFilter;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
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

  confirmedAt?: string | null;
  shippedAt?: string | null;
  inTransitAt?: string | null;
  outForDeliveryAt?: string | null;
  deliveredAt?: string | null;

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

export type StepKey =
  | "PLACED"
  | "CONFIRMED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export interface Step {
  key: StepKey;
  title: string;
  icon: LucideIcon;
  reachedDescription: string;
  currentDescription?: string;
  upcomingDescription: string;
}
