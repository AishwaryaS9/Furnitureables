import { prisma } from "@/lib/prisma";
import ProductClient from "./ProductClient";

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      media: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);
  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return <ProductClient product={product} />;
}