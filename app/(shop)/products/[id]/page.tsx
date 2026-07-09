import ProductClient from "@/components/product/ProductClient";
import { Product } from "@/types/product";

async function getProduct(id: string): Promise<Product | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.NEXT_VERCEL_URL
      ? `${process.env.NEXT_VERCEL_URL}`
      : `${process.env.NEXT_PUBLIC_APP_URL}`);
  const url = new URL("/api/graphql", baseUrl).toString();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetProduct($id: String!) {
          product(id: $id) {
            id
            title
            description
            price
            image  
            material
            type
            color
            room
            dimensions
            stock
          }
        }
      `,
      variables: { id },
    }),
    cache: "no-store",
  });

  const json = await res.json();

  if (json.errors) return null;

  return json.data.product;
}

export default async function ProductPage({
  params,
}: {
  // params: { id: string };
  params: Promise<{ id: string }>;
}) {
  // const { id } = params;
  const { id } = await params;

  const product = await getProduct(id);
  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return <ProductClient product={product} />;
}