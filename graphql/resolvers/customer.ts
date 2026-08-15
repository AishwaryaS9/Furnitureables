import { prisma } from "@/lib/prisma";

const NON_REVENUE_STATUSES = ["CANCELLED"] as const;

export const customerResolver = {
    Query: {
        adminCustomers: async () => {
            const users = await prisma.user.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    orders: {
                        where: {
                            status: {
                                notIn: [...NON_REVENUE_STATUSES],
                            },
                        },
                        select: {
                            total: true,
                            currency: true,
                            createdAt: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                },
            });

            return users.map((user) => {
                const totalSpent = user.orders.reduce(
                    (sum, order) => sum + order.total,
                    0
                );

                return {
                    id: user.id,
                    name:
                        [user.firstName, user.lastName]
                            .filter(Boolean)
                            .join(" ") || "Unnamed Customer",
                    email: user.email,
                    joinedAt: user.createdAt.toISOString(),
                    totalOrders: user.orders.length,
                    totalSpent,
                    currency: user.orders[0]?.currency ?? "INR",
                    lastOrderAt:
                        user.orders[0]?.createdAt.toISOString() ?? null,
                };
            });
        },

        // Detail view: single customer with full address book and order history.
        adminCustomer: async (_: unknown, { id }: { id: string }) => {
            const user = await prisma.user.findUnique({
                where: { id },
                include: {
                    addresses: {
                        orderBy: {
                            isDefault: "desc",
                        },
                    },
                    orders: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        include: {
                            items: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!user) return null;

            const revenueOrders = user.orders.filter(
                (order) =>
                    !NON_REVENUE_STATUSES.includes(
                        order.status as (typeof NON_REVENUE_STATUSES)[number]
                    )
            );

            const totalSpent = revenueOrders.reduce(
                (sum, order) => sum + order.total,
                0
            );

            return {
                id: user.id,
                name:
                    [user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") || "Unnamed Customer",
                email: user.email,
                joinedAt: user.createdAt.toISOString(),
                totalOrders: revenueOrders.length,
                totalSpent,
                currency: revenueOrders[0]?.currency ?? "INR",
                lastOrderAt:
                    user.orders[0]?.createdAt.toISOString() ?? null,
                addresses: user.addresses.map((address) => ({
                    id: address.id,
                    fullName: address.fullName,
                    phoneCode: address.phoneCode,
                    phone: address.phone,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    landmark: address.landmark,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country,
                    isDefault: address.isDefault,
                })),
                orders: user.orders.map((order) => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    itemsCount: order.items.length,
                    total: order.total,
                    currency: order.currency,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    createdAt: order.createdAt.toISOString(),
                })),
            };
        },
    },
};
