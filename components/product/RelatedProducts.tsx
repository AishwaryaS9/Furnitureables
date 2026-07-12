"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function RelatedProducts({ type, id }: any) {
    const { data, isLoading } = useQuery({
        queryKey: ["related", type, id],
        queryFn: async () => {
            const res = await fetch("/api/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
            query ($filter: ProductFilterInput) {
              products(filter: $filter, related: true) {
                  items {
                        id
                        title
                        price
                        createdAt
                        material
                        color

                media {
                    id
                    url
                    type
                    sortOrder
                }
                }   
              }
            }
          `,
                    variables: {
                        filter: {
                            category: type,
                            excludeId: id,
                        },
                    },
                }),
            });

            const json = await res.json();
            return json.data?.products?.items || [];
        },
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="space-y-4 animate-pulse">
                        <div className="aspect-4/3 sm:aspect-[1.6] w-full rounded-2xl bg-zinc-100" />
                        <div className="space-y-2">
                            <div className="h-4 bg-zinc-100 rounded w-2/3" />
                            <div className="h-4 bg-zinc-100 rounded w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                    <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">Unique Item</h3>
                <p className="text-xs text-zinc-500 max-w-xs mt-1 mb-4 leading-relaxed">
                    This item is part of an exclusive collection, but you can find more amazing alternatives in our main catalog.
                </p>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-700 transition-colors group"
                >
                    Explore all furniture
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {data.map((p: any) => (
                <div key={p.id} className="transition-all duration-300 hover:-translate-y-1">
                    <ProductCard product={p} />
                </div>
            ))}
        </div>
    );
}