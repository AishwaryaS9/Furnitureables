"use client";

import { useState, useMemo } from "react";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import CustomerStats from "@/components/admin/customers/CustomerStats";
import CustomerTable from "@/components/admin/customers/CustomerTable";
import CustomerSearch, { CustomerSort } from "@/components/admin/customers/CustomerSearch";
import ProductPagination from "@/components/admin/products/ProductPagination";

const PAGE_SIZE = 8;

export default function CustomersPage() {
    const { data } = useAdminCustomers();

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<CustomerSort>("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleSortChange = (value: CustomerSort) => {
        setSort(value);
        setCurrentPage(1);
    };

    const customers = data ?? [];

    const filteredCustomers = useMemo(() => {
        const keyword = search.toLowerCase();

        const filtered = customers.filter((customer) => {
            return (
                !search ||
                customer.name.toLowerCase().includes(keyword) ||
                customer.email.toLowerCase().includes(keyword)
            );
        });

        const sorted = [...filtered].sort((a, b) => {
            switch (sort) {
                case "oldest":
                    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
                case "most-orders":
                    return b.totalOrders - a.totalOrders;
                case "highest-spend":
                    return b.totalSpent - a.totalSpent;
                case "newest":
                default:
                    return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
            }
        });

        return sorted;
    }, [customers, search, sort]);

    // Pagination Slicing
    const totalItems = filteredCustomers.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const total = customers.length;

    const now = new Date();
    const newThisMonth = customers.filter((c) => {
        const joined = new Date(c.joinedAt);
        return (
            joined.getMonth() === now.getMonth() &&
            joined.getFullYear() === now.getFullYear()
        );
    }).length;

    const repeatCustomers = customers.filter((c) => c.totalOrders > 1).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    const isFiltered = Boolean(search) || sort !== "newest";

    return (
        <main
            id="main-content"
            tabIndex={-1}
            aria-labelledby="customers-page-title"
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 focus:outline-none"
        >
            {/* Header Landmark */}
            <header className="space-y-2">
                <h1
                    id="customers-page-title"
                    className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground truncate gap-2.5 py-1"
                >
                    Customers
                </h1>
                <p className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                    View every customer who has signed up on your store, along with their order history.
                </p>
            </header>

            {/* Customer Statistics Landmark */}
            <section aria-labelledby="customer-stats-heading">
                <h2 id="customer-stats-heading" className="sr-only">
                    Customer Statistics Overview
                </h2>
                <CustomerStats
                    total={total}
                    newThisMonth={newThisMonth}
                    repeatCustomers={repeatCustomers}
                    totalRevenue={totalRevenue}
                />
            </section>

            {/* Search, Sort, and Table Section */}
            <section
                aria-labelledby="customer-list-heading"
                className="space-y-4 w-full"
            >
                <h2 id="customer-list-heading" className="sr-only">
                    Customers Management Table
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CustomerSearch
                        value={search}
                        onChange={handleSearchChange}
                        sort={sort}
                        onSortChange={handleSortChange}
                    />

                    <div
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        className="shrink-0"
                    >
                        {isFiltered ? (
                            <p className="text-xs text-muted-foreground font-medium">
                                Showing {filteredCustomers.length} of {customers.length} customers
                            </p>
                        ) : (
                            <span className="sr-only">
                                Showing all {customers.length} customers
                            </span>
                        )}
                    </div>
                </div>

                {/* Table Container */}
                <div className="w-full overflow-x-auto">
                    <CustomerTable customers={paginatedCustomers} />
                </div>

                {/* Pagination Controls */}
                <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                    itemLabel="customers"
                />
            </section>
        </main>
    );
}
