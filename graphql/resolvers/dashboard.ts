import { prisma } from "@/lib/prisma";
import { format, startOfMonth, subMonths } from "date-fns";

const NON_REVENUE_STATUSES = ["CANCELLED"] as const;

export const dashboardResolver = {
    Query: {
        adminDashboardStats: async () => {
            const [revenueAgg, totalOrders, totalProducts, totalCustomers] =
                await Promise.all([
                    prisma.order.aggregate({
                        _sum: {
                            total: true,
                        },
                        where: {
                            status: {
                                notIn: [...NON_REVENUE_STATUSES],
                            },
                        },
                    }),
                    prisma.order.count({
                        where: {
                            status: {
                                notIn: [...NON_REVENUE_STATUSES],
                            },
                        },
                    }),
                    prisma.product.count(),
                    prisma.user.count(),
                ]);

            return {
                totalRevenue: revenueAgg._sum.total ?? 0,
                totalOrders,
                totalProducts,
                totalCustomers,
            };
        },

        adminSalesChart: async (
            _: unknown,
            { months = 6 }: { months?: number }
        ) => {
            const span = months && months > 0 ? months : 6;
            const now = new Date();
            const rangeStart = startOfMonth(subMonths(now, span - 1));

            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: rangeStart,
                    },
                    status: {
                        notIn: [...NON_REVENUE_STATUSES],
                    },
                },
                select: {
                    createdAt: true,
                    total: true,
                },
            });

            const buckets = new Map<
                string,
                { date: string; revenue: number }
            >();

            for (let i = 0; i < span; i++) {
                const bucketDate = subMonths(now, span - 1 - i);
                const key = format(bucketDate, "yyyy-MM");

                buckets.set(key, {
                    date: format(bucketDate, "MMM"),
                    revenue: 0,
                });
            }

            for (const order of orders) {
                const key = format(order.createdAt, "yyyy-MM");
                const bucket = buckets.get(key);

                if (bucket) {
                    bucket.revenue += order.total;
                }
            }

            return Array.from(buckets.values());
        },

        adminLowStockProducts: async (
            _: unknown,
            {
                threshold = 10,
                limit = 5,
            }: { threshold?: number; limit?: number }
        ) => {
            return prisma.product.findMany({
                where: {
                    stock: {
                        lte: threshold ?? 10,
                    },
                },
                orderBy: {
                    stock: "asc",
                },
                take: limit ?? 5,
                select: {
                    id: true,
                    title: true,
                    sku: true,
                    stock: true,
                },
            });
        },

        adminRecentOrders: async (
            _: unknown,
            { limit = 5 }: { limit?: number }
        ) => {
            const orders = await prisma.order.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: limit ?? 5,
                select: {
                    id: true,
                    orderNumber: true,
                    fullName: true,
                    createdAt: true,
                    total: true,
                    currency: true,
                    status: true,
                },
            });

            return orders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.fullName,
                createdAt: order.createdAt.toISOString(),
                total: order.total,
                currency: order.currency,
                status: order.status,
            }));
        },
    },
};
