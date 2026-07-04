import { prisma } from "@/lib/prisma";

export const productResolvers = {
    Query: {
        products: async (_: any, args: any) => {
            const { filter } = args;

            const where: any = {};

            if (filter) {
                if (filter.category) {
                    where.category = filter.category;
                }

                if (filter.material) {
                    where.material = filter.material;
                }

                if (filter.color) {
                    where.color = filter.color;
                }

                if (filter.room) {
                    where.room = filter.room;
                }

                if (filter.minPrice || filter.maxPrice) {
                    where.price = {};

                    if (filter.minPrice) {
                        where.price.gte = filter.minPrice;
                    }

                    if (filter.maxPrice) {
                        where.price.lte = filter.maxPrice;
                    }
                }
            }

            return prisma.product.findMany({
                where,
                orderBy: {
                    createdAt: "desc",
                },
            });
        },
    },
};