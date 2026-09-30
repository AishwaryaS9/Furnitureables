import { Prisma } from "@/generated/prisma/index";
import { prisma } from "@/lib/prisma";
import { fetchProductCategories } from "@/lib/data/catalog";
import { auth } from "@clerk/nextjs/server";
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

                if (filter.search?.trim()) {
                    where.title = {
                        contains: filter.search.trim(),
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

            const [total, items] = await Promise.all([
                prisma.product.count({ where }),
                prisma.product.findMany({
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
                }),
            ]);

            // Resolve `isWishlisted` for the whole page with (at most) two
            // queries instead of two queries per product.
            const { userId: clerkUserId } = await auth();
            let wishlistedIds = new Set<string>();

            if (clerkUserId && items.length > 0) {
                const dbUser = await prisma.user.findUnique({
                    where: { clerkId: clerkUserId },
                    select: { id: true },
                });

                if (dbUser) {
                    const saved = await prisma.wishlist.findMany({
                        where: {
                            userId: dbUser.id,
                            productId: { in: items.map((item) => item.id) },
                        },
                        select: { productId: true },
                    });
                    wishlistedIds = new Set(saved.map((w) => w.productId));
                }
            }

            return {
                items: items.map((item) => ({
                    ...item,
                    isWishlisted: wishlistedIds.has(item.id),
                })),
                total,
            };
        },

        productCategories: async (
            _parent: unknown,
            { limit = 5 }: { limit?: number }
        ) => fetchProductCategories(limit ?? 5),

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

        adminProducts: async (
            _parent: unknown,
            {
                search,
                page = 1,
                limit = 8,
            }: { search?: string; page?: number; limit?: number }
        ) => {
            const trimmedSearch = search?.trim();
            const where: Prisma.ProductWhereInput = trimmedSearch
                ? {
                    OR: [
                        { title: { contains: trimmedSearch, mode: "insensitive" } },
                        { sku: { contains: trimmedSearch, mode: "insensitive" } },
                    ],
                }
                : {};

            const [total, items, totalProducts, statsRows] = await Promise.all([
                prisma.product.count({ where }),

                prisma.product.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
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
                }),
                prisma.product.count(),
                prisma.product.findMany({
                    select: {
                        price: true,
                        stock: true,
                    },
                }),
            ]);

            const lowStockCount = statsRows.filter(
                (p) => p.stock > 0 && p.stock <= 5
            ).length;

            const outOfStockCount = statsRows.filter((p) => p.stock === 0).length;

            const inventoryValue = statsRows.reduce(
                (sum, p) => sum + p.price * p.stock,
                0
            );

            return {
                items,
                total,
                totalProducts,
                lowStockCount,
                outOfStockCount,
                inventoryValue,
            };
        },
    },

    Product: {
        isWishlisted: async (parent: { id: string; isWishlisted?: boolean }) => {
            // Already resolved in bulk by the `products` query.
            if (typeof parent.isWishlisted === "boolean") return parent.isWishlisted;

            const { userId } = await auth();

            if (!userId) return false;

            const user = await prisma.user.findUnique({
                where: {
                    clerkId: userId,
                },
                select: {
                    id: true,
                },
            });

            if (!user) return false;

            const exists = await prisma.wishlist.findUnique({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId: parent.id,
                    },
                },
                select: {
                    id: true,
                },
            });
            return !!exists;
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