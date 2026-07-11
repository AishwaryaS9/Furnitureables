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
                    const exists = await prisma.product.findUnique({
                        where: {
                            sku: product.sku,
                        },
                    });

                    await prisma.product.upsert({
                        where: {
                            sku: product.sku,
                        },

                        update: {
                            title: product.title,
                            description: product.description,
                            price: Number(product.price),
                            stock: Number(product.stock),
                            image: product.image,
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
                            image: product.image,
                            type: product.type,
                            material: product.material,
                            color: product.color,
                            room: product.room,
                            dimensions: product.dimensions,
                            sku: product.sku,
                        },
                    });

                    if (exists) {
                        updated++;
                    } else {
                        inserted++;
                    }
                } catch (error) {
                    console.error(
                        `Failed to upload product with SKU ${product.sku}:`,
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