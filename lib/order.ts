import { PaymentMethod } from "@/generated/prisma";
import { Order, OrderStatus, OrderStatusFilter, PaymentStatusFilter, Step, StepKey } from "@/types/order";
import { format, isValid } from "date-fns";
import { Boxes, ClipboardCheck, MapPin, Package, PackageCheck, Truck } from "lucide-react";

export function generateOrderNumber() {
  return `ORD-${Date.now()}`;
}

export function formatOrderDate(date: string) {
  const parsed = new Date(date);

  if (!isValid(parsed)) {
    return "-";
  }

  return format(parsed, "dd MMM yyyy");
}

export function formatCurrency(
  amount: number,
  currency = "INR"
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatStepTime(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("day")} ${get("month")} · ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`;
}

export function getStepTimestamp(order: Order, key: StepKey) {
  switch (key) {
    case "PLACED":
      return order.createdAt;
    case "CONFIRMED":
      return order.confirmedAt ?? order.createdAt;
    case "SHIPPED":
      return order.shippedAt;
    case "IN_TRANSIT":
      return order.inTransitAt;
    case "OUT_FOR_DELIVERY":
      return order.outForDeliveryAt;
    case "DELIVERED":
      return order.deliveredAt;
  }
}

export function getOrderStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "CONFIRMED":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "SHIPPED":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "IN_TRANSIT":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    case "OUT_FOR_DELIVERY":
      return "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20";
    case "DELIVERED":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "CANCELLED":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function getPaymentStatusColor(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "FAILED":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    case "REFUNDED":
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    case "PENDING":
    default:
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
}

export function calculateOrderTotals() {
  // Reserved for future coupon/tax calculations
}

export function getPaymentMethodLabel(method: PaymentMethod | string) {
  switch (method) {
    case "COD":
      return "Cash on Delivery";
    case "RAZORPAY":
      return "Razorpay";
    case "STRIPE":
      return "Stripe";
    default:
      return method ? method.charAt(0) + method.slice(1).toLowerCase() : "";
  }
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function formatOrderStatus(status: string) {
  return (
    ORDER_STATUS_LABELS[status as OrderStatus] ??
    status.charAt(0) + status.slice(1).toLowerCase()
  );
}

export const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const ORDER_STATUS_OPTIONS: { value: OrderStatusFilter; label: string }[] = [
  { value: "ALL", label: "All order statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatusFilter; label: string }[] = [
  { value: "ALL", label: "All payments statuses" },
  { value: "PAID", label: "Paid" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];


export const steps: readonly Step[] = [
  {
    key: "PLACED",
    title: "Order Placed",
    icon: Package,
    reachedDescription: "We've received your order.",
    currentDescription: "We've received your order.",
    upcomingDescription: "Awaiting order placement",
  },
  {
    key: "CONFIRMED",
    title: "Order Confirmed",
    icon: ClipboardCheck,
    reachedDescription: "Your order has been confirmed.",
    upcomingDescription: "Awaiting confirmation",
  },
  {
    key: "SHIPPED",
    title: "Packed & Shipped",
    icon: Boxes,
    reachedDescription: "Your order has been packed and shipped.",
    upcomingDescription: "Awaiting packing and dispatch",
  },
  {
    key: "IN_TRANSIT",
    title: "In Transit",
    icon: Truck,
    reachedDescription: "Your order was on its way.",
    currentDescription: "Your order is on its way.",
    upcomingDescription: "Awaiting shipment",
  },
  {
    key: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    icon: MapPin,
    reachedDescription: "Handed to our delivery agent.",
    currentDescription: "Your order is out with our delivery agent.",
    upcomingDescription: "Awaiting dispatch to delivery agent",
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    icon: PackageCheck,
    reachedDescription: "Package delivered successfully.",
    upcomingDescription: "Awaiting delivery",
  },
];

export const statusIndex: Record<Exclude<OrderStatus, "CANCELLED">, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  IN_TRANSIT: 3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED: 5,
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Order Confirmed",
  SHIPPED: "Packed & Shipped",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
