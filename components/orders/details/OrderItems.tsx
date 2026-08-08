import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductThumbnail from "../ProductThumbnail";
import { formatCurrency } from "@/lib/order";
import { OrderItem } from "@/types/order";

interface OrderItemsProps {
    items: OrderItem[];
}

export default function OrderItems({ items }: OrderItemsProps) {
    const totalItemTypes = items.length;

    return (
        <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
            <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                        Items Ordered
                    </CardTitle>
                    <span className="text-xs font-mono font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border/50">
                        {totalItemTypes} {totalItemTypes === 1 ? "Item" : "Items"}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="divide-y divide-border/40 p-5 sm:p-6">
                {items.map((item) => {
                    const itemTotal = item.price * item.quantity;
                    const productHref = item.product?.id ? `/products/${item.product.id}` : "#";

                    return (
                        <article
                            key={item.id}
                            className="flex items-start gap-4 sm:gap-5 py-5 first:pt-0 last:pb-0"
                        >
                            {/* Product Image Link */}
                            <Link
                                href={productHref}
                                aria-label={`View product details for ${item.title}`}
                                className="shrink-0 transition-opacity hover:opacity-90"
                            >
                                <ProductThumbnail
                                    image={item.image}
                                    title={item.title}
                                    size="md"
                                />
                            </Link>

                            {/* Product Info & Breakdown */}
                            <div className="flex-1 min-w-0 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                    <div className="space-y-0.5 min-w-0">
                                        <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground line-clamp-2">
                                            {item.product?.id ? (
                                                <Link
                                                    href={productHref}
                                                    className="hover:underline hover:text-primary transition-colors"
                                                >
                                                    {item.title}
                                                </Link>
                                            ) : (
                                                item.title
                                            )}
                                        </h3>

                                        {item.sku && (
                                            <p className="text-xs font-mono text-muted-foreground">
                                                SKU: {item.sku}
                                            </p>
                                        )}
                                    </div>

                                    {/* Line Item Total (Right-aligned on desktop, inline on mobile) */}
                                    <div className="text-left sm:text-right shrink-0">
                                        <p className="text-sm sm:text-base font-medium text-foreground">
                                            {formatCurrency(itemTotal)}
                                        </p>
                                    </div>
                                </div>

                                {/* Sub-details Toolbar (Quantity & Unit Price) */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1 ">
                                    <div className="inline-flex items-center gap-1">
                                        <span>Qty:</span>
                                        <span className="font-semibold text-foreground font-mono">
                                            {item.quantity}
                                        </span>
                                    </div>

                                    <span className="text-border" aria-hidden="true">•</span>

                                    <div className="inline-flex items-center gap-1">
                                        <span>Unit Price:</span>
                                        <span className="font-medium text-foreground">
                                            {formatCurrency(item.price)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </CardContent>
        </Card>
    );
}
