import { graphqlServerClient } from "@/lib/graphql/server-client";
import { PRODUCT_BY_ID } from "@/lib/graphql/queries";
import { ProductResponse } from "@/types/graphql";
import ProductClient from "./ProductClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = await graphqlServerClient();

  const { product } =
    await client.request<ProductResponse>(
      PRODUCT_BY_ID,
      { id }
    );

  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return <ProductClient product={product} />;
}