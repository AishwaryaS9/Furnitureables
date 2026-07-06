"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ type, id }: any) {
    const { data } = useQuery({
        queryKey: ["related", type],
        queryFn: async () => {
            const res = await fetch("/api/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
            query ($filter: ProductFilterInput) {
              products(filter: $filter) {
                id
                title
                price
                image
              }
            }
          `,
                    variables: {
                        filter: {
                            type,
                            excludeId: id,
                        },
                    },
                }),
            });

            const json = await res.json();
            return json.data.products;
        },
    });

    if (!data) return null;

    return (
        <div className="mt-16 space-y-4">
            <h2 className="text-xl font-semibold">Related Products</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}