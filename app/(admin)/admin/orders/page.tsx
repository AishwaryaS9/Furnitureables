"use client";

import { useState } from "react";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import OrderStats from "@/components/admin/orders/OrderStats";
import OrderSearch, { OrderStatusFilter } from "@/components/admin/orders/OrderSearch";
import OrderTable from "@/components/admin/orders/OrderTable";
import ProductPagination from "@/components/admin/products/ProductPagination";

const PAGE_SIZE = 8;

export default function OrdersPage() {
    const { data } = useAdminOrders();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<OrderStatusFilter>("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value: OrderStatusFilter) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const orders = data ?? [];

    const filteredOrders = orders.filter((order) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
            order.orderNumber.toLowerCase().includes(keyword) ||
            order.customerName.toLowerCase().includes(keyword) ||
            order.customerEmail.toLowerCase().includes(keyword);

        const matchesStatus = status === "ALL" || order.status === status;

        return matchesSearch && matchesStatus;
    });

    // Pagination Slicing
    const totalItems = filteredOrders.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const total = orders.length;
    const pending = orders.filter(
        (o) => o.status === "PENDING" || o.status === "CONFIRMED"
    ).length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const revenue = orders
        .filter((o) => o.status !== "CANCELLED")
        .reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {/* Header Landmark */}
            <header className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground truncate gap-2.5 py-1">
                    Orders
                </h1>
                <p
                    role="status"
                    aria-live="polite"
                    className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed"
                >
                    View and track every order placed on your store.
                </p>
            </header>

            {/* Order Statistics Landmark */}
            <section aria-label="Order Statistics Overview">
                <OrderStats
                    total={total}
                    pending={pending}
                    delivered={delivered}
                    revenue={revenue}
                />
            </section>

            {/* Search and Table Landmark */}
            <section aria-label="Orders Table" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <OrderSearch
                        value={search}
                        onChange={handleSearchChange}
                        status={status}
                        onStatusChange={handleStatusChange}
                    />
                    {(search || status !== "ALL") && (
                        <p className="text-xs text-muted-foreground font-medium shrink-0" aria-live="polite">
                            Showing {filteredOrders.length} of {orders.length} orders
                        </p>
                    )}
                </div>

                <OrderTable orders={paginatedOrders} />

                <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                    itemLabel="orders"
                />
            </section>
        </div>
    );
}
