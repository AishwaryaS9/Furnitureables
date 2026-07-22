import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductThumbnail from "../ProductThumbnail";
import { formatCurrency } from "@/lib/order";
import { OrderItem } from "@/types/order";

interface OrderItemsProps {
    items: OrderItem[];
}

export default function OrderItems({
    items,
}: OrderItemsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                    >
                        <ProductThumbnail
                            image={item.image}
                            title={item.title}
                            size="md"
                        />

                        <div className="flex-1 space-y-2">
                            <div>
                                <h3 className="font-semibold">
                                    {item.title}
                                </h3>

                                {item.sku && (
                                    <p className="text-sm text-muted-foreground">
                                        SKU: {item.sku}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                                <span>
                                    Qty:{" "}
                                    <span className="font-medium">
                                        {item.quantity}
                                    </span>
                                </span>

                                <span>
                                    Price:{" "}
                                    <span className="font-medium">
                                        {formatCurrency(item.price)}
                                    </span>
                                </span>

                                <span className="font-semibold">
                                    {formatCurrency(
                                        item.price * item.quantity
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}