import { Prisma } from "@/generated/prisma/index";
import { prisma } from "@/lib/prisma";
import { CreateProductArgs, ProductsArgs, UpdateProductArgs } from "@/types/product";

export const productResolvers = {
    Query: {
        products: async (_parent: unknown, args: ProductsArgs) => {
            const {
                filter,
                page = 1,
                limit = 8,
                related = false,
            } = args;

            const where: Prisma.ProductWhereInput = {};

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

            let orderBy: Prisma.ProductOrderByWithRelationInput = {
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
                include: {
                    media: {
                        orderBy: {
                            sortOrder: "asc",
                        },
                    },
                },
            });

            return {
                items,
                total,
            };
        },

        product: async (
            _parent: unknown,
            { id }: { id: string }
        ) => {
            return prisma.product.findUnique({
                where: { id },
                include: {
                    media: {
                        orderBy: {
                            sortOrder: "asc",
                        },
                    },
                },
            });
        },

        adminProducts: async () => {
            return prisma.product.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    media: {
                        orderBy: {
                            sortOrder: "asc",
                        },
                    },
                },
            });
        },
    },

    Mutation: {
        createProduct: async (
            _parent: unknown,
            { input }: CreateProductArgs
        ) => {
            const { media, ...productData } = input;

            return prisma.product.create({
                data: {
                    ...productData,
                    media: {
                        create: media ?? [],
                    },
                },
                include: {
                    media: true,
                },
            });
        },

        updateProduct: async (
            _parent: unknown,
            { id, input }: UpdateProductArgs
        ) => {
            const { media, ...productData } = input;

            return prisma.product.update({
                where: {
                    id,
                },
                data: {
                    ...productData,

                    ...(media && {
                        media: {
                            deleteMany: {},
                            create: media,
                        },
                    }),
                },
                include: {
                    media: true,
                },
            });
        },

        deleteProduct: async (
            _parent: unknown,
            { id }: { id: string }
        ) => {
            await prisma.product.delete({
                where: {
                    id,
                },
            });

            return true;
        },
    },
};