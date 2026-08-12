"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import ProductTable from "@/components/admin/products/ProductTable";
import ProductStats from "@/components/admin/products/ProductStats";
import ProductSearch from "@/components/admin/products/ProductSearch";
import ProductPagination from "@/components/admin/products/ProductPagination";

const PAGE_SIZE = 8;

export default function AdminProductsPage() {
    const { data } = useAdminProducts();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const filteredProducts = (data ?? []).filter((product) => {
        const keyword = search.toLowerCase();

        return (
            product.title.toLowerCase().includes(keyword) ||
            product.sku.toLowerCase().includes(keyword)
        );
    });

    // Pagination Slicing
    const totalItems = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const total = filteredProducts.length;

    const lowStock = filteredProducts.filter(
        (p) => p.stock <= 5 && p.stock > 0
    ).length;

    const outOfStock = filteredProducts.filter((p) => p.stock === 0).length;

    const inventoryValue = filteredProducts.reduce(
        (sum, p) => sum + p.price * p.stock,
        0
    );

    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {/* Header Landmark */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="space-y-2 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground truncate gap-2.5 py-1">
                        Product Management
                    </h1>
                    <p
                        role="status"
                        aria-live="polite"
                        className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed"
                    >
                        Manage your store catalog, track inventory levels, and add new products.
                    </p>
                </div>
                <Link href="/admin/products/new" tabIndex={-1} className="shrink-0 focus:outline-none">
                    <Button
                        type="button"
                        className="h-11 px-8 rounded-2xl font-semibold gap-2 shadow-sm shadow-primary/20 hover:shadow-md transition-all w-full sm:w-auto"
                        aria-label="Add new product to catalog"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        <span>Add Product</span>
                    </Button>
                </Link>
            </header>

            {/* Product Statistics Landmark */}
            <section aria-label="Product Statistics Overview">
                <ProductStats
                    total={total}
                    lowStock={lowStock}
                    outOfStock={outOfStock}
                    inventoryValue={inventoryValue}
                />
            </section>

            {/* Search and Table Landmark */}
            <section aria-label="Product Inventory Table" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="w-full sm:max-w-md">
                        <ProductSearch value={search} onChange={handleSearchChange} />
                    </div>
                    {search && (
                        <p className="text-xs text-muted-foreground font-medium" aria-live="polite">
                            Showing {filteredProducts.length} of {data?.length ?? 0} products
                        </p>
                    )}
                </div>

                <ProductTable products={paginatedProducts} />

                <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                />
            </section>
        </div>
    );
}