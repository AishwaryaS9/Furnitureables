import ProductClient from "./ProductClient";

async function getProduct(id: string) {
  const res = await fetch("http://localhost:3000/api/graphql", {
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
            price
            image
            material
            type
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
}) {
  const { id } = await params;

  const product = await getProduct(id);
  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return <ProductClient product={product} />;
}