// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import PaymentStatusBadge from "@/components/orders/PaymentStatusBadge";

describe("OrderStatusBadge", () => {
    it.each([
        ["PENDING", "Pending"],
        ["CONFIRMED", "Confirmed"],
        ["SHIPPED", "Shipped"],
        ["DELIVERED", "Delivered"],
        ["CANCELLED", "Cancelled"],
    ] as const)("shows %s as %s", (status, label) => {
        render(<OrderStatusBadge status={status} />);

        expect(screen.getByText(label)).toBeInTheDocument();
        expect(screen.getByLabelText(`Order status: ${label}`)).toBeInTheDocument();
    });

    it.each([
        ["PENDING", "amber"],
        ["CONFIRMED", "indigo"],
        ["SHIPPED", "blue"],
        ["DELIVERED", "emerald"],
        ["CANCELLED", "rose"],
    ] as const)("colours %s with %s", (status, color) => {
        render(<OrderStatusBadge status={status} />);

        expect(screen.getByLabelText(/Order status/).className).toContain(color);
    });

    it("has no 'Order:' label unless asked", () => {
        render(<OrderStatusBadge status="SHIPPED" />);

        expect(screen.queryByText("Order:")).not.toBeInTheDocument();
    });

    it("shows the 'Order:' label when showLabel is set", () => {
        render(<OrderStatusBadge status="SHIPPED" showLabel />);

        expect(screen.getByText("Order:")).toBeInTheDocument();
    });

    it("adds a custom class name", () => {
        render(<OrderStatusBadge status="SHIPPED" className="my-extra-class" />);

        expect(screen.getByLabelText("Order status: Shipped")).toHaveClass("my-extra-class");
    });
});

describe("PaymentStatusBadge", () => {
    it.each([
        ["PAID", "Paid"],
        ["PENDING", "Pending"],
        ["FAILED", "Failed"],
        ["REFUNDED", "Refunded"],
    ] as const)("shows %s as %s", (status, label) => {
        render(<PaymentStatusBadge status={status} />);

        expect(screen.getByText(label)).toBeInTheDocument();
        expect(screen.getByLabelText(`Payment status: ${label}`)).toBeInTheDocument();
    });

    it.each([
        ["PAID", "emerald"],
        ["PENDING", "amber"],
        ["FAILED", "rose"],
        ["REFUNDED", "slate"],
    ] as const)("colours %s with %s", (status, color) => {
        render(<PaymentStatusBadge status={status} />);

        expect(screen.getByLabelText(/Payment status/).className).toContain(color);
    });

    it("shows the 'Payment:' label only when showLabel is set", () => {
        const { rerender } = render(<PaymentStatusBadge status="PAID" />);
        expect(screen.queryByText("Payment:")).not.toBeInTheDocument();

        rerender(<PaymentStatusBadge status="PAID" showLabel />);
        expect(screen.getByText("Payment:")).toBeInTheDocument();
    });

    it("adds a custom class name", () => {
        render(<PaymentStatusBadge status="PAID" className="my-extra-class" />);

        expect(screen.getByLabelText("Payment status: Paid")).toHaveClass("my-extra-class");
    });
});
