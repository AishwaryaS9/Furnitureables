import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Order } from "@/types/order";
import { formatCurrency, formatOrderDate } from "@/lib/order";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import ProductThumbnail from "./ProductThumbnail";

interface Props {
    order: Order;
}

export default function OrderCard({ order }: Props) {
    const itemCount = order.items.length;
    const visibleItems = order.items.slice(0, 3);
    const hiddenItemCount = itemCount - visibleItems.length;
    const formattedDate = formatOrderDate(order.createdAt);
    const formattedTotal = formatCurrency(order.total, order.currency);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Order",
                        "orderNumber": order.orderNumber,
                        "orderDate": order.createdAt,
                        "orderStatus": `https://schema.org/${order.status}`,
                        "price": order.total,
                        "priceCurrency": order.currency,
                    }),
                }}
            />

            <article
                aria-labelledby={`order-${order.id}-heading`}
                className="group border-b border-border/60 py-6 first:pt-0 last:border-b-0 transition-colors"
            >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    {/* Order Identity, Date & Status */}
                    <div className="space-y-2.5 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3
                                id={`order-${order.id}-heading`}
                                className="text-base sm:text-md font-[600] tracking-tight text-foreground"
                            >
                                Order #{order.orderNumber}
                            </h3>
                            <span className="text-xs text-muted-foreground font-light">
                                <time dateTime={new Date(order.createdAt).toISOString()}>
                                    {formattedDate}
                                </time>
                            </span>
                        </div>

                        <div
                            className="flex items-center gap-2 flex-wrap"
                            aria-label="Order and payment status"
                        >
                            <OrderStatusBadge status={order.status} />
                            <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                    </div>

                    {/* Product Thumbnails Preview */}
                    {itemCount > 0 && (
                        <ul
                            className="flex items-center gap-2.5 overflow-x-auto py-1"
                            aria-label={`Preview of items in order #${order.orderNumber}`}
                        >
                            {visibleItems.map((item) => (
                                <li key={item.id} className="shrink-0">
                                    <ProductThumbnail
                                        image={item.image}
                                        title={item.title}
                                        size="sm"
                                    />
                                </li>
                            ))}

                            {hiddenItemCount > 0 && (
                                <li
                                    className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border/50 bg-secondary/40 text-[11px] font-mono font-medium text-muted-foreground"
                                    aria-label={`Plus ${hiddenItemCount} more item${hiddenItemCount > 1 ? "s" : ""}`}
                                >
                                    <span className="font-semibold text-foreground">
                                        +{hiddenItemCount}
                                    </span>
                                </li>
                            )}
                        </ul>
                    )}

                    {/* Total Ledger & Action Link */}
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t border-border/30 pt-4 md:border-t-0 md:pt-0">
                        <div className="text-left md:text-right">
                            <p className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                                <span className="sr-only">Order total: </span>
                                {formattedTotal}
                            </p>
                            <p className="text-xs text-muted-foreground font-light">
                                {itemCount} {itemCount === 1 ? "item" : "items"}
                            </p>
                        </div>

                        <Link
                            href={`/orders/${order.id}`}
                            aria-label={`View full details for order #${order.orderNumber}`}
                            className={cn(
                                buttonVariants({ variant: "ghost", size: "sm" }),
                                "group/btn inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold tracking-wide uppercase rounded-xl transition-all cursor-pointer",
                                "text-primary hover:bg-secondary hover:text-primary"
                            )}
                        >
                            <span>View Details</span>
                            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2] transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 shrink-0" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
}


