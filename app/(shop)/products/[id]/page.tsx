
import { Product } from "@/types/product";
import ProductClient from "./ProductClient";

async function getProduct(id: string): Promise<Product | null> {
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  const url = new URL("/api/graphql", baseUrl).toString();

  console.log("Base URL:", baseUrl);
  console.log("Final URL:", url);

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

  console.log("Request URL:", url);
  console.log("Status:", res.status);

  const text = await res.text();
  console.log("Raw response:", text);

  const json = JSON.parse(text);

  return json.data?.product ?? null;

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