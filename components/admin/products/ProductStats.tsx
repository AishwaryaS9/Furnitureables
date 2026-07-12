"use client";

import { Card } from "@/components/ui/card";

interface Props {
    total: number;
    lowStock: number;
    outOfStock: number;
    inventoryValue: number;
}

export default function ProductStats({
    total,
    lowStock,
    outOfStock,
    inventoryValue,
}: Props) {
    const stats = [
        {
            title: "Total Products",
            value: total,
        },
        {
            title: "Low Stock",
            value: lowStock,
        },
        {
            title: "Out of Stock",
            value: outOfStock,
        },
        {
            title: "Inventory Value",
            value: `₹${inventoryValue.toLocaleString()}`,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <Card
                    key={stat.title}
                    className="p-5"
                >
                    <p className="text-sm text-gray-500">
                        {stat.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {stat.value}
                    </h2>
                </Card>
            ))}
        </div>
    );
}