// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    ORDER_STATUS_OPTIONS,
    PAYMENT_STATUS_OPTIONS,
    STATUS_OPTIONS,
    formatCurrency,
    formatOrderDate,
    generateOrderNumber,
    getOrderStatusColor,
    getPaymentMethodLabel,
    getPaymentStatusColor,
} from "@/lib/order";

afterEach(() => {
    vi.useRealTimers();
});

describe("generateOrderNumber", () => {
    it("is ORD- followed by the current timestamp", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(1_700_000_000_000));

        expect(generateOrderNumber()).toBe("ORD-1700000000000");
    });
});

describe("formatOrderDate", () => {
    it("formats a valid date as dd MMM yyyy", () => {
        const iso = new Date(2024, 2, 15, 12).toISOString();
        expect(formatOrderDate(iso)).toBe("15 Mar 2024");
    });

    it("shows a dash for an invalid date", () => {
        expect(formatOrderDate("not a date")).toBe("-");
    });

    it("shows a dash for an empty string", () => {
        expect(formatOrderDate("")).toBe("-");
    });
});

describe("formatCurrency", () => {
    it("formats rupees with Indian digit grouping and no decimals", () => {
        expect(formatCurrency(123456)).toBe("₹1,23,456");
        expect(formatCurrency(0)).toBe("₹0");
    });

    it("rounds to whole rupees", () => {
        expect(formatCurrency(1234.5)).toBe("₹1,235");
    });

    it("can format another currency", () => {
        expect(formatCurrency(1500, "USD")).toBe("$1,500");
    });
});

describe("getOrderStatusColor", () => {
    it.each([
        ["PENDING", "amber"],
        ["CONFIRMED", "indigo"],
        ["SHIPPED", "blue"],
        ["DELIVERED", "emerald"],
        ["CANCELLED", "rose"],
    ])("%s uses %s", (status, color) => {
        expect(getOrderStatusColor(status)).toContain(color);
    });

    it("falls back to a neutral style for an unknown status", () => {
        expect(getOrderStatusColor("WHATEVER")).toContain("bg-muted");
    });
});

describe("getPaymentStatusColor", () => {
    it.each([
        ["PAID", "emerald"],
        ["FAILED", "rose"],
        ["REFUNDED", "slate"],
        ["PENDING", "amber"],
    ])("%s uses %s", (status, color) => {
        expect(getPaymentStatusColor(status)).toContain(color);
    });

    it("treats an unknown status like pending", () => {
        expect(getPaymentStatusColor("WHATEVER")).toBe(getPaymentStatusColor("PENDING"));
    });
});

describe("getPaymentMethodLabel", () => {
    it.each([
        ["COD", "Cash on Delivery"],
        ["RAZORPAY", "Razorpay"],
        ["STRIPE", "Stripe"],
    ])("%s is labelled %s", (method, label) => {
        expect(getPaymentMethodLabel(method)).toBe(label);
    });

    it("title-cases an unknown method", () => {
        expect(getPaymentMethodLabel("UPI")).toBe("Upi");
    });

    it("returns an empty string for an empty method", () => {
        expect(getPaymentMethodLabel("")).toBe("");
    });
});

describe("status option lists", () => {
    it("has the five order statuses", () => {
        expect(STATUS_OPTIONS.map((o) => o.value)).toEqual([
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ]);
    });

    it("the order filter is the same list plus ALL first", () => {
        expect(ORDER_STATUS_OPTIONS[0].value).toBe("ALL");
        expect(ORDER_STATUS_OPTIONS.slice(1)).toEqual(STATUS_OPTIONS);
    });

    it("the payment filter starts with ALL and lists every payment status", () => {
        expect(PAYMENT_STATUS_OPTIONS.map((o) => o.value)).toEqual([
            "ALL",
            "PAID",
            "PENDING",
            "FAILED",
            "REFUNDED",
        ]);
    });
});
