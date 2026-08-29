"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useDebounce } from "@/hooks/useDebounce";
import ProductTable from "@/components/admin/products/ProductTable";
import ProductStats from "@/components/admin/products/ProductStats";
import ProductSearch from "@/components/admin/products/ProductSearch";
import ProductPagination from "@/components/admin/products/ProductPagination";

const PAGE_SIZE = 8;

export default function AdminProductsPage() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedSearch = useDebounce(search, 350);

    const { data, isFetching } = useAdminProducts({
        search: debouncedSearch,
        page: currentPage,
        limit: PAGE_SIZE,
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
                    total={data?.totalProducts ?? 0}
                    lowStock={data?.lowStockCount ?? 0}
                    outOfStock={data?.outOfStockCount ?? 0}
                    inventoryValue={data?.inventoryValue ?? 0}
                />
            </section>

            {/* Search and Table Landmark */}
            <section aria-label="Product Inventory Table" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="w-full sm:max-w-md">
                        <ProductSearch value={search} onChange={handleSearchChange} />
                    </div>
                    {debouncedSearch && (
                        <p className="text-xs text-muted-foreground font-medium" aria-live="polite">
                            Showing {total} {total === 1 ? "result" : "results"} for &quot;{debouncedSearch}&quot;
                        </p>
                    )}
                </div>

                <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
                    <ProductTable products={items} />
                </div>

                <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={total}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                />
            </section>
        </div>
    );
}
