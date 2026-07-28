import { PaymentMethod } from "@/generated/prisma";
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
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 border-blue-200";

    case "SHIPPED":
      return "bg-purple-100 text-purple-800 border-purple-200";

    case "DELIVERED":
      return "bg-green-100 text-green-800 border-green-200";

    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";

    default:
      return "";
  }
}

export function getPaymentStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    case "PAID":
      return "bg-green-100 text-green-800 border-green-200";

    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200";

    case "REFUNDED":
      return "bg-slate-100 text-slate-700 border-slate-200";

    default:
      return "";
  }
}

export function calculateOrderTotals() {
  // Reserved for future coupon/tax calculations
}

export function getPaymentMethodLabel(method: PaymentMethod) {
  switch (method) {
    case "COD":
      return "Cash on Delivery";

    case "RAZORPAY":
      return "Razorpay";

    case "STRIPE":
      return "Stripe";

    default:
      return method;
  }
}