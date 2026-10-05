// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { analyticsResolver } from "@/graphql/resolvers/analytics";
import { couponResolvers } from "@/graphql/resolvers/coupon";
import { customerResolver } from "@/graphql/resolvers/customer";
import { dashboardResolver } from "@/graphql/resolvers/dashboard";
import { notificationResolvers } from "@/graphql/resolvers/notification";
import { orderResolver } from "@/graphql/resolvers/order";
import { productResolvers } from "@/graphql/resolvers/product";
import { reviewResolver } from "@/graphql/resolvers/review";
import { uploadResolver } from "@/graphql/resolvers/upload";

const { fakeDatabase } = vi.hoisted(() => {
    const make = (): unknown =>
        new Proxy(function () { }, {
            get: (_target, prop) => (prop === "then" ? undefined : make()),
            apply: () => Promise.resolve([]),
        });

    return { fakeDatabase: make };
});

vi.mock("@/lib/prisma", () => ({ prisma: fakeDatabase() }));
vi.mock("@/lib/razorpay", () => ({ razorpay: {} }));
vi.mock("@/lib/stripe", () => ({ getStripe: vi.fn() }));
vi.mock("@/lib/order/buildOrder", () => ({ buildOrder: vi.fn() }));
vi.mock("@/lib/order/onOrderConfirmed", () => ({ sendOrderConfirmedSideEffects: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => ({
    auth: vi.fn().mockResolvedValue({ userId: null }),
    currentUser: vi.fn().mockResolvedValue(null),
    clerkClient: vi.fn(),
}));
vi.mock("@/lib/auth/admin", () => ({ getAdminUser: vi.fn().mockResolvedValue(null) }));

type Operation = (parent: unknown, args: Record<string, unknown>) => Promise<unknown>;

const op = (fn: unknown) => fn as Operation;

const args = {
    id: "some-id",
    status: "SHIPPED",
    search: "",
    page: 1,
    limit: 8,
    days: 7,
    months: 6,
    input: { title: "Hacked", price: 1, stock: 1, sku: "X", media: [] },
    products: [],
};

const adminOnly: [string, Operation][] = [
    // orders
    ["adminOrders (every customer's orders and emails)", op(orderResolver.Query.adminOrders)],
    ["adminUpdateOrderStatus (change any order's status)", op(orderResolver.Mutation.adminUpdateOrderStatus)],
    // products
    ["adminProducts", op(productResolvers.Query.adminProducts)],
    ["createProduct", op(productResolvers.Mutation.createProduct)],
    ["updateProduct", op(productResolvers.Mutation.updateProduct)],
    ["deleteProduct", op(productResolvers.Mutation.deleteProduct)],
    ["uploadProducts", op(uploadResolver.Mutation.uploadProducts)],
    // customers
    ["adminCustomers (customer list)", op(customerResolver.Query.adminCustomers)],
    ["adminCustomer (one customer's addresses and orders)", op(customerResolver.Query.adminCustomer)],
    // dashboard
    ["adminDashboardStats", op(dashboardResolver.Query.adminDashboardStats)],
    ["adminSalesChart", op(dashboardResolver.Query.adminSalesChart)],
    ["adminLowStockProducts", op(dashboardResolver.Query.adminLowStockProducts)],
    ["adminRecentOrders", op(dashboardResolver.Query.adminRecentOrders)],
    // analytics
    ...Object.entries(analyticsResolver.Query).map(
        ([name, fn]) => [name, op(fn)] as [string, Operation]
    ),
];

const AUTH_ERROR = /unauthori[sz]ed|forbidden|not authori[sz]ed|admin|permission|sign in|not allowed/i;

describe("admin-only GraphQL operations reject callers who are not admins", () => {
    for (const [name, operation] of adminOnly) {
        it.fails(name, async () => {
            await expect(operation({}, args)).rejects.toThrow(AUTH_ERROR);
        });
    }
});

const alreadyProtected: [string, Operation][] = [
    ["adminCoupons", op(couponResolvers.Query.adminCoupons)],
    ["adminCreateCoupon", op(couponResolvers.Mutation.adminCreateCoupon)],
    ["adminUpdateCoupon", op(couponResolvers.Mutation.adminUpdateCoupon)],
    ["adminDeleteCoupon", op(couponResolvers.Mutation.adminDeleteCoupon)],
    ["adminNotifications", op(notificationResolvers.Query.adminNotifications)],
    ["adminUnreadNotificationCount", op(notificationResolvers.Query.adminUnreadNotificationCount)],
    ["adminMarkNotificationRead", op(notificationResolvers.Mutation.adminMarkNotificationRead)],
    ["adminMarkAllNotificationsRead", op(notificationResolvers.Mutation.adminMarkAllNotificationsRead)],
    ["adminReviews", op(reviewResolver.Query.adminReviews)],
    ["adminUpdateReviewStatus", op(reviewResolver.Mutation.adminUpdateReviewStatus)],
    ["adminDeleteReview", op(reviewResolver.Mutation.adminDeleteReview)],
];

describe("admin-only operations that are already protected (control)", () => {
    for (const [name, operation] of alreadyProtected) {
        it(name, async () => {
            await expect(operation({}, args)).rejects.toThrow(AUTH_ERROR);
        });
    }
});
