export const CHART_COLORS = [
    "#D97706",
    "var(--accent)",
    "var(--chart-2)",
    "var(--success)",
    "var(--chart-4)",
    "var(--chart-1)",
];

export const ORDER_STATUS_COLORS: Record<string, string> = {
    PENDING: "var(--chart-2)",
    CONFIRMED: "var(--accent)",
    SHIPPED: "#D97706",
    DELIVERED: "var(--success)",
    CANCELLED: "var(--destructive)",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    COD: "Cash on Delivery",
    RAZORPAY: "Razorpay",
    STRIPE: "Stripe",
};

export const PAYMENT_METHOD_COLORS: Record<string, string> = {
    COD: "var(--chart-2)",
    RAZORPAY: "#D97706",
    STRIPE: "var(--accent)",
};

export const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

export const compactCurrencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
});

export function tooltipStyle() {
    return {
        borderRadius: "0.75rem",
        border: "1px solid var(--border)",
        background: "var(--popover)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        fontSize: "12px",
        padding: "8px 12px",
    };
}
