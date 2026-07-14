import { useQuery } from "@tanstack/react-query";
import { RELATED_PRODUCTS } from "@/lib/graphql/queries";
import { Product } from "@/types/product";

interface RelatedProductsProps {
    type: string;
    id: string;
}

interface RelatedProductsResponse {
    data: {
        products: {
            items: Product[];
        };
    };
}

export function useRelatedProducts({
    type,
    id,
}: RelatedProductsProps) {
    return useQuery({
        queryKey: ["related", type, id],

        enabled: !!type,

        queryFn: async () => {
            const res = await fetch("/api/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: RELATED_PRODUCTS,
                    variables: {
                        filter: {
                            category: type,
                            excludeId: id,
                        },
                    },
                }),
            });

            const json: RelatedProductsResponse = await res.json();

            return json.data.products.items;
        },
    });
}