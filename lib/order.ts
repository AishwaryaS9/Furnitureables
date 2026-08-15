import { PaymentMethod } from "@/generated/prisma";
import { OrderStatus, OrderStatusFilter, PaymentStatusFilter } from "@/types/order";
import { format, isValid } from "date-fns";

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

export function getOrderStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "CONFIRMED":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "SHIPPED":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
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

export const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const ORDER_STATUS_OPTIONS: { value: OrderStatusFilter; label: string }[] = [
  { value: "ALL", label: "All order statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SHIPPED", label: "Shipped" },
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