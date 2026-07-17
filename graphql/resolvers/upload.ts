import { prisma } from "@/lib/prisma";
import { ProductUploadInput } from "@/types/product";

export const uploadResolver = {
    Mutation: {
        uploadProducts: async (
            _: unknown,
            {
                products,
            }: {
                products: ProductUploadInput[];
            }
        ) => {
            let inserted = 0;
            let updated = 0;
            let failed = 0;

            for (const product of products) {
                try {
                    const existing = await prisma.product.findUnique({
                        where: {
                            sku: product.sku,
                        },
                    });


                    const savedProduct = await prisma.product.upsert({
                        where: {
                            sku: product.sku,
                        },

                        update: {
                            title: product.title,
                            description: product.description,
                            price: Number(product.price),
                            stock: Number(product.stock),

                            type: product.type,
                            material: product.material,
                            color: product.color,
                            room: product.room,
                            dimensions: product.dimensions,
                        },

                        create: {
                            title: product.title,
                            description: product.description,
                            price: Number(product.price),
                            stock: Number(product.stock),

                            type: product.type,
                            material: product.material,
                            color: product.color,
                            room: product.room,
                            dimensions: product.dimensions,
                            sku: product.sku,
                        },
                    });

                    // Replace existing media with uploaded media
                    if (product.media?.length) {
                        await prisma.productMedia.deleteMany({
                            where: {
                                productId: savedProduct.id,
                            },
                        });

                        await prisma.productMedia.createMany({
                            data: product.media.map((media, index) => ({
                                productId: savedProduct.id,
                                url: media.url,
                                type: media.type,
                                altText: media.altText ?? null,
                                sortOrder: media.sortOrder ?? index,
                            })),
                        });
                    }

                    if (existing) {
                        updated++;
                    } else {
                        inserted++;
                    }
                } catch (error) {
                    console.error(
                        `Failed to upload product with SKU ${product.sku} `,
                        error
                    );

                    failed++;
                }
            }

            return {
                inserted,
                updated,
                failed,
            };
        },
    },
};

