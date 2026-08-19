import { prisma } from "@/lib/prisma";
import { format, startOfDay, startOfMonth, subDays, subMonths } from "date-fns";

const NON_REVENUE_STATUSES = ["CANCELLED"] as const;

export const analyticsResolver = {
    Query: {
        // Line + Bar (Composed) — revenue & order volume trend
        adminRevenueTrend: async (
            _: unknown,
            { days = 30 }: { days?: number }
        ) => {
            const span = days && days > 0 ? days : 30;
            const now = new Date();
            const rangeStart = startOfDay(subDays(now, span - 1));

            const orders = await prisma.order.findMany({
                where: {
                    createdAt: { gte: rangeStart },
                    status: { notIn: [...NON_REVENUE_STATUSES] },
                },
                select: { createdAt: true, total: true },
            });

            const buckets = new Map<
                string,
                { date: string; revenue: number; orders: number }
            >();

            for (let i = 0; i < span; i++) {
                const bucketDate = subDays(now, span - 1 - i);
                const key = format(bucketDate, "yyyy-MM-dd");

                buckets.set(key, {
                    date: format(bucketDate, "MMM d"),
                    revenue: 0,
                    orders: 0,
                });
            }

            for (const order of orders) {
                const key = format(order.createdAt, "yyyy-MM-dd");
                const bucket = buckets.get(key);

                if (bucket) {
                    bucket.revenue += order.total;
                    bucket.orders += 1;
                }
            }

            return Array.from(buckets.values());
        },

        // Pie — order status breakdown
        adminOrderStatusDistribution: async () => {
            const grouped = await prisma.order.groupBy({
                by: ["status"],
                _count: { _all: true },
            });

            return grouped.map((row) => ({
                status: row.status,
                count: row._count._all,
            }));
        },

        // Bar (horizontal) — best-selling products by revenue
        adminTopProducts: async (
            _: unknown,
            { limit = 5 }: { limit?: number }
        ) => {
            const items = await prisma.orderItem.findMany({
                where: {
                    order: { status: { notIn: [...NON_REVENUE_STATUSES] } },
                },
                select: { productId: true, title: true, price: true, quantity: true },
            });

            const totals = new Map<
                string,
                { id: string; title: string; revenue: number; unitsSold: number }
            >();

            for (const item of items) {
                const existing = totals.get(item.productId);
                const revenue = item.price * item.quantity;

                if (existing) {
                    existing.revenue += revenue;
                    existing.unitsSold += item.quantity;
                } else {
                    totals.set(item.productId, {
                        id: item.productId,
                        title: item.title,
                        revenue,
                        unitsSold: item.quantity,
                    });
                }
            }

            return Array.from(totals.values())
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, limit && limit > 0 ? limit : 5);
        },

        // Radar — revenue & order count by room category
        adminCategoryPerformance: async () => {
            const items = await prisma.orderItem.findMany({
                where: {
                    order: { status: { notIn: [...NON_REVENUE_STATUSES] } },
                },
                select: {
                    price: true,
                    quantity: true,
                    orderId: true,
                    product: { select: { room: true } },
                },
            });

            const totals = new Map<
                string,
                { category: string; revenue: number; orderIds: Set<string> }
            >();

            for (const item of items) {
                const category = item.product?.room ?? "Other";
                const existing = totals.get(category);
                const revenue = item.price * item.quantity;

                if (existing) {
                    existing.revenue += revenue;
                    existing.orderIds.add(item.orderId);
                } else {
                    totals.set(category, {
                        category,
                        revenue,
                        orderIds: new Set([item.orderId]),
                    });
                }
            }

            return Array.from(totals.values())
                .map((row) => ({
                    category: row.category,
                    revenue: row.revenue,
                    orders: row.orderIds.size,
                }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 8);
        },

        // Area — cumulative customer growth
        adminCustomerGrowth: async (
            _: unknown,
            { months = 6 }: { months?: number }
        ) => {
            const span = months && months > 0 ? months : 6;
            const now = new Date();
            const rangeStart = startOfMonth(subMonths(now, span - 1));

            const [usersInRange, priorCount] = await Promise.all([
                prisma.user.findMany({
                    where: { createdAt: { gte: rangeStart } },
                    select: { createdAt: true },
                }),
                prisma.user.count({
                    where: { createdAt: { lt: rangeStart } },
                }),
            ]);

            const buckets = new Map<
                string,
                { date: string; newCustomers: number }
            >();

            for (let i = 0; i < span; i++) {
                const bucketDate = subMonths(now, span - 1 - i);
                const key = format(bucketDate, "yyyy-MM");

                buckets.set(key, {
                    date: format(bucketDate, "MMM"),
                    newCustomers: 0,
                });
            }

            for (const user of usersInRange) {
                const key = format(user.createdAt, "yyyy-MM");
                const bucket = buckets.get(key);

                if (bucket) bucket.newCustomers += 1;
            }

            let running = priorCount;

            return Array.from(buckets.values()).map((bucket) => {
                running += bucket.newCustomers;

                return {
                    date: bucket.date,
                    newCustomers: bucket.newCustomers,
                    totalCustomers: running,
                };
            });
        },

        // Radial Bar — payment method split
        adminPaymentMethodDistribution: async () => {
            const grouped = await prisma.order.groupBy({
                by: ["paymentMethod"],
                _count: { _all: true },
                _sum: { total: true },
            });

            return grouped.map((row) => ({
                method: row.paymentMethod,
                count: row._count._all,
                revenue: row._sum.total ?? 0,
            }));
        },

        // Bar — review rating distribution
        adminRatingDistribution: async () => {
            const grouped = await prisma.review.groupBy({
                by: ["rating"],
                where: { status: "APPROVED" },
                _count: { _all: true },
            });

            const buckets = new Map<number, number>([
                [1, 0],
                [2, 0],
                [3, 0],
                [4, 0],
                [5, 0],
            ]);

            for (const row of grouped) {
                buckets.set(row.rating, row._count._all);
            }

            return Array.from(buckets.entries())
                .sort((a, b) => a[0] - b[0])
                .map(([rating, count]) => ({ rating, count }));
        },

        // Scatter — inventory stock levels vs units sold
        adminStockVsSales: async (
            _: unknown,
            { limit = 20 }: { limit?: number }
        ) => {
            const [products, items] = await Promise.all([
                prisma.product.findMany({
                    select: { id: true, title: true, stock: true },
                }),
                prisma.orderItem.findMany({
                    where: {
                        order: { status: { notIn: [...NON_REVENUE_STATUSES] } },
                    },
                    select: { productId: true, quantity: true },
                }),
            ]);

            const soldMap = new Map<string, number>();

            for (const item of items) {
                soldMap.set(
                    item.productId,
                    (soldMap.get(item.productId) ?? 0) + item.quantity
                );
            }

            return products
                .map((product) => ({
                    id: product.id,
                    title: product.title,
                    stock: product.stock,
                    unitsSold: soldMap.get(product.id) ?? 0,
                }))
                .sort((a, b) => b.unitsSold - a.unitsSold)
                .slice(0, limit && limit > 0 ? limit : 20);
        },

        // Treemap — revenue share by product type
        adminCategoryRevenueShare: async () => {
            const items = await prisma.orderItem.findMany({
                where: {
                    order: { status: { notIn: [...NON_REVENUE_STATUSES] } },
                },
                select: {
                    price: true,
                    quantity: true,
                    product: { select: { type: true } },
                },
            });

            const totals = new Map<string, number>();

            for (const item of items) {
                const type = item.product?.type ?? "Other";
                const revenue = item.price * item.quantity;

                totals.set(type, (totals.get(type) ?? 0) + revenue);
            }

            return Array.from(totals.entries())
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);
        },

        // Funnel — order lifecycle progression
        adminOrderFunnel: async () => {
            const [placed, confirmed, shipped, delivered] = await Promise.all([
                prisma.order.count({
                    where: { status: { notIn: [...NON_REVENUE_STATUSES] } },
                }),
                prisma.order.count({
                    where: { status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } },
                }),
                prisma.order.count({
                    where: { status: { in: ["SHIPPED", "DELIVERED"] } },
                }),
                prisma.order.count({ where: { status: "DELIVERED" } }),
            ]);

            return [
                { stage: "Placed", count: placed },
                { stage: "Confirmed", count: confirmed },
                { stage: "Shipped", count: shipped },
                { stage: "Delivered", count: delivered },
            ];
        },
    },
};
