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

export function getOrderStatusColor() {

}

export function getPaymentStatusColor() {

}

export function calculateOrderTotals() {

}