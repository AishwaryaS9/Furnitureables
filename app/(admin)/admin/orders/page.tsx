"use client";

import { useState, useMemo } from "react";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import OrderStats from "@/components/admin/orders/OrderStats";
import OrderTable from "@/components/admin/orders/OrderTable";
import ProductPagination from "@/components/admin/products/ProductPagination";
import OrderSearch from "@/components/admin/orders/OrderSearch";
import { OrderStatusFilter, PaymentStatusFilter } from "@/types/order";

const PAGE_SIZE = 8;

export default function OrdersPage() {
    const { data } = useAdminOrders();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<OrderStatusFilter>("ALL");
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatusFilter>("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value: OrderStatusFilter) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handlePaymentStatusChange = (value: PaymentStatusFilter) => {
        setPaymentStatus(value);
        setCurrentPage(1);
    };

    const orders = data ?? [];

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const keyword = search.toLowerCase();

            const matchesSearch =
                !search ||
                order.orderNumber.toLowerCase().includes(keyword) ||
                order.customerName.toLowerCase().includes(keyword) ||
                order.customerEmail.toLowerCase().includes(keyword);

            const matchesStatus = status === "ALL" || order.status === status;
            const matchesPayment = paymentStatus === "ALL" || order.paymentStatus === paymentStatus;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [orders, search, status, paymentStatus]);

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

    const isFiltered = Boolean(search) || status !== "ALL" || paymentStatus !== "ALL";

    return (
        <main
            id="main-content"
            tabIndex={-1}
            aria-labelledby="orders-page-title"
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 focus:outline-none"
        // className="space-y-6 sm:space-y-8 max-w-7xl mx-auto"
        >
            {/* Header Landmark */}
            <header className="space-y-2">
                <h1
                    id="orders-page-title"
                    className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground truncate gap-2.5 py-1"
                >
                    Orders
                </h1>
                <p className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                    View and track every order placed on your store.
                </p>
            </header>

            {/* Order Statistics Landmark */}
            <section aria-labelledby="order-stats-heading">
                <h2 id="order-stats-heading" className="sr-only">
                    Order Statistics Overview
                </h2>
                <OrderStats
                    total={total}
                    pending={pending}
                    delivered={delivered}
                    revenue={revenue}
                />
            </section>

            {/* Search, Filter, and Table Section */}
            <section
                aria-labelledby="order-list-heading"
                className="space-y-4 w-full"
            >
                <h2 id="order-list-heading" className="sr-only">
                    Orders Management Table
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <OrderSearch
                        value={search}
                        onChange={handleSearchChange}
                        status={status}
                        onStatusChange={handleStatusChange}
                        paymentStatus={paymentStatus}
                        onPaymentStatusChange={handlePaymentStatusChange}
                    />

                    {/* Live status container for screen reader announcements */}
                    <div
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        className="shrink-0"
                    >
                        {isFiltered ? (
                            <p className="text-xs text-muted-foreground font-medium">
                                Showing {filteredOrders.length} of {orders.length} orders
                            </p>
                        ) : (
                            <span className="sr-only">
                                Showing all {orders.length} orders
                            </span>
                        )}
                    </div>
                </div>

                {/* Table Container */}
                <div className="w-full overflow-x-auto">
                    <OrderTable orders={paginatedOrders} />
                </div>

                {/* Pagination Controls */}
                <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                    itemLabel="orders"
                />
            </section>
        </main>
    );
}