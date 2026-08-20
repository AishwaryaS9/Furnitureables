"use client";

import { useState } from "react";
import { Order } from "@/types/order";
import OrderCard from "./OrderCard";
import Pagination from "../product/Pagination";


const PAGE_SIZE = 5;

interface OrdersFeedProps {
    orders: Order[];
}

export default function OrdersFeed({ orders }: OrdersFeedProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(orders.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedOrders = orders.slice(startIndex, startIndex + PAGE_SIZE);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const orderSection = document.getElementById("order-list-heading");
        if (orderSection) {
            orderSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="space-y-6">
            {/* Orders Feed */}
            <div
                role="feed"
                aria-labelledby="order-list-heading"
                className="space-y-4 sm:space-y-5"
            >
                {paginatedOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}