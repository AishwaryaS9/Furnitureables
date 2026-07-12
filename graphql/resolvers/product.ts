import { prisma } from "@/lib/prisma";

export const productResolvers = {
    Query: {
        products: async (_: any, args: any) => {
            const {
                filter,
                page = 1,
                limit = 8,
                related = false,
            } = args;

            const where: any = {};

            if (filter) {
                if (filter.category) {
                    where.type = filter.category;
                }

                if (filter.room) {
                    where.room = filter.room;
                }

                if (filter.material) {
                    where.material = filter.material;
                }

                if (filter.color) {
                    where.color = filter.color;
                }

                if (filter.search) {
                    where.title = {
                        contains: filter.search,
                        mode: "insensitive",
                    };
                }

                if (filter.excludeId) {
                    where.NOT = {
                        id: filter.excludeId,
                    };
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

            const total = await prisma.product.count({
                where,
            });

            let orderBy: any = {
                createdAt: "desc",
            };

            switch (filter?.sortBy) {
                case "priceAsc":
                    orderBy = { price: "asc" };
                    break;

                case "priceDesc":
                    orderBy = { price: "desc" };
                    break;

                case "nameAsc":
                    orderBy = { title: "asc" };
                    break;

                case "nameDesc":
                    orderBy = { title: "desc" };
                    break;

                default:
                    orderBy = { createdAt: "desc" };
            }

            const items = await prisma.product.findMany({
                where,
                skip: related ? undefined : (page - 1) * limit,
                take: related ? 4 : limit,
                orderBy,
            });

            return {
                items,
                total,
            };
        },

        product: async (_: any, { id }: { id: string }) => {
            return prisma.product.findUnique({
                where: { id },
            });
        },

        adminProducts: async () => {
            return prisma.product.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });
        },
    },

    Mutation: {
        createProduct: async (_: any, { data }: any) => {
            return prisma.product.create({
                data,
            });
        },

        updateProduct: async (_: any, { id, data }: any) => {
            return prisma.product.update({
                where: {
                    id,
                },
                data,
            });
        },

        deleteProduct: async (_: any, { id }: { id: string }) => {
            await prisma.product.delete({
                where: {
                    id,
                },
            });

            return true;
        },
    },
};