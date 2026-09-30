import { prisma } from "@/lib/prisma";

/**
 * Shared, auth-free catalog queries. They are used by the GraphQL resolvers
 * AND by server components (home page), so the public storefront data can be
 * rendered on the server and cached instead of being fetched by the browser
 * after hydration.
 */

export interface ProductCategoryRow {
    type: string;
    count: number;
    image: string | null;
}

export async function fetchProductCategories(limit = 5): Promise<ProductCategoryRow[]> {
    const grouped = await prisma.product.groupBy({
        by: ["type"],
        _count: { type: true },
        orderBy: { _count: { type: "desc" } },
        take: limit ?? 5,
    });

    const rows = grouped.filter((g) => !!g.type);

    const thumbnails = await Promise.all(
        rows.map((g) =>
            prisma.product.findFirst({
                where: {
                    type: g.type,
                    media: { some: { type: "IMAGE" } },
                },
                orderBy: { createdAt: "desc" },
                select: {
                    media: {
                        where: { type: "IMAGE" },
                        orderBy: { sortOrder: "asc" },
                        take: 1,
                        select: { url: true },
                    },
                },
            })
        )
    );

    return rows.map((g, index) => ({
        type: g.type,
        count: g._count.type,
        image: thumbnails[index]?.media[0]?.url ?? null,
    }));
}

/** First page of the storefront, newest first (what the home page shows). */
export async function fetchFeaturedProducts(limit = 8) {
    const [total, items] = await Promise.all([
        prisma.product.count(),
        prisma.product.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                price: true,
                type: true,
                material: true,
                createdAt: true,
                stock: true,
                media: {
                    orderBy: { sortOrder: "asc" },
                    select: { id: true, url: true, type: true, sortOrder: true },
                },
            },
        }),
    ]);

    return {
        total,
        // Same shape the GraphQL `GET_PRODUCTS` query returns to the client.
        items: items.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
            isWishlisted: false,
        })),
    };
}
