"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import ProductTable from "@/components/admin/products/ProductTable";
import { useState } from "react";
import ProductStats from "@/components/admin/products/ProductStats";
import ProductSearch from "@/components/admin/products/ProductSearch";

export default function AdminProductsPage() {
    const { data, isLoading } = useAdminProducts();
    const [search, setSearch] = useState("");

    const filteredProducts =
        (data ?? []).filter((product) => {
            const keyword = search.toLowerCase();

            return (
                product.title
                    .toLowerCase()
                    .includes(keyword) ||
                product.sku
                    .toLowerCase()
                    .includes(keyword)
            );
        });

    const total = filteredProducts.length;

    const lowStock = filteredProducts.filter(
        (p) => p.stock <= 5 && p.stock > 0
    ).length;

    const outOfStock =
        filteredProducts.filter(
            (p) => p.stock === 0
        ).length;

    const inventoryValue =
        filteredProducts.reduce(
            (sum, p) => sum + p.price * p.stock,
            0
        );



    if (isLoading) {
        return (
            <p className="p-8">
                Loading products...
            </p>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Product Management
                </h1>

                <Link href="/admin/products/new">
                    <Button>
                        Add Product
                    </Button>
                </Link>
            </div>

            <ProductStats
                total={total}
                lowStock={lowStock}
                outOfStock={outOfStock}
                inventoryValue={inventoryValue}
            />

            <ProductSearch
                value={search}
                onChange={setSearch}
            />

            <ProductTable
                products={filteredProducts}
            />
        </div>
    );
}