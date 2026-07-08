import { Product } from "@/types/product";
import ProductClient from "./ProductClient";

// async function getProduct(id: string) {
async function getProduct(id: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const res = await fetch(`${baseUrl}/api/graphql`, {
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
  params: Promise<{ id: string }>;
  // params: { id: string }
}) {
  const { id } = await params;

  const product = await getProduct(id);
  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return <ProductClient product={product} />;
}