"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product/ProductCard";
import { ShoppingBag } from "lucide-react";
import Pagination from "@/components/product/Pagination";
import { useFilterStore } from "@/store/useFilterStore";

export default function ProductsPage() {
    const page = useFilterStore((s) => s.page);

    const { data: products, isLoading } = useQuery({
        queryKey: ["products", page],

        queryFn: async () => {
            const res = await fetch("/api/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    query: `
                        query GetProducts($page: Int, $limit: Int) {
                            products(
                            page: $page
                            limit: $limit
                            ) {
                               total

                                items {
                                    id
                                    title
                                    price
                                    image
                                    type
                                    material
                                }
                            }
                        }
                    `,
                    variables: {
                        page,
                        limit: 8,
                    },
                }),
            });

            const json = await res.json();

            return json.data?.products;
        },
    });

    const items = products?.items || [];
    const total = products?.total || 0;

    const totalPages = Math.ceil(total / 8);

    return (
        <main className="min-h-screen bg-white text-zinc-900 antialiased">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">

                {/* Header */}
                <div className="space-y-2 border-b border-zinc-100 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                        All Collections
                    </h1>

                    <p className="text-sm text-zinc-500">
                        Explore our complete catalog of premium solid wood furniture and modern designs.
                    </p>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className="space-y-4 animate-pulse"
                            >
                                <div className="aspect-[1.6] rounded-2xl bg-zinc-100" />

                                <div className="space-y-2">
                                    <div className="h-4 bg-zinc-100 rounded w-2/3" />
                                    <div className="h-4 bg-zinc-100 rounded w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading &&
                    (!items || items.length === 0) && (
                        <div className="text-center py-24 max-w-md mx-auto space-y-3">

                            <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 mx-auto">
                                <ShoppingBag className="w-6 h-6" />
                            </div>

                            <h3 className="text-base font-semibold">
                                No products found
                            </h3>

                            <p className="text-sm text-zinc-500">
                                We are updating our stock right now.
                                Please check back shortly.
                            </p>

                        </div>
                    )}

                {/* Products */}
                {!isLoading &&
                    items &&
                    items.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">

                                {items.map((product: any) => (
                                    <div
                                        key={product.id}
                                        className="transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}

                            </div>

                            <Pagination totalPages={totalPages} />
                        </>
                    )}

            </div>
        </main>
    );
}
