import Link from "next/link";
import { Order } from "@/types/order";
import { formatCurrency, formatOrderDate } from "@/lib/order";
import DownloadInvoiceButton from "./DownloadInvoiceButton";

interface InvoiceProps {
    order: Order;
}

export default function Invoice({ order }: InvoiceProps) {
    const currency = order.currency;
    const formattedDate = formatOrderDate(order.createdAt);

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Invoice",
                        "identifier": order.orderNumber,
                        "paymentMethod": order.paymentMethod,
                        "paymentStatus": order.paymentStatus,
                        "totalPaymentDue": {
                            "@type": "PriceSpecification",
                            "price": order.total,
                            "priceCurrency": currency,
                        },
                        "billingAddress": {
                            "@type": "PostalAddress",
                            "name": order.fullName,
                            "streetAddress": `${order.addressLine1}${order.addressLine2 ? `, ${order.addressLine2}` : ""}`,
                            "addressLocality": order.city,
                            "addressRegion": order.state,
                            "postalCode": order.postalCode,
                            "addressCountry": order.country,
                        },
                    }),
                }}
            />

            {/* Action Bar */}
            <div className="mb-6 flex items-center justify-between print:hidden">
                <Link
                    href={`/orders/${order.id}`}
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Back to Order
                </Link>
                <DownloadInvoiceButton order={order} />
            </div>

            {/* Main Print Container */}
            <article
                aria-label={`Official tax invoice for order #${order.orderNumber}`}
                className="rounded-2xl border border-border/60 bg-card p-5 sm:p-10 shadow-2xs print:m-0 print:max-w-none print:rounded-none print:border-0 print:bg-white print:p-0 print:text-black print:shadow-none"
            >
                {/* Top Header Row */}
                <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-border/60 pb-8 print:border-black/20">
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="inline-block text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground print:text-black"
                        >
                            Furniture<span className="font-sans font-normal text-muted-foreground print:text-black/70">ables</span>
                        </Link>

                        <p className="text-xs sm:text-sm text-muted-foreground font-light print:text-black/70">
                            Premium Furniture for Modern Living
                        </p>

                        <div className="text-xs font-mono text-muted-foreground space-y-0.5 pt-1 print:text-black/80">
                            <p>support@furnitureables.com</p>
                            <p>www.furnitureables.com</p>
                        </div>
                    </div>

                    <div className="text-left sm:text-right space-y-2">
                        <div className="inline-flex items-center gap-2 flex-wrap sm:justify-end">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-primary print:text-black">
                                INVOICE
                            </h1>
                            {order.paymentStatus === "PAID" && (
                                <span className="inline-block rounded-md border border-emerald-600/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 print:border-black print:bg-transparent print:text-black">
                                    PAID
                                </span>
                            )}
                        </div>

                        <div className="space-y-1 text-xs sm:text-sm text-muted-foreground font-light pt-2 print:text-black">
                            <p>
                                <span className="font-semibold text-foreground print:text-black">Invoice No:</span>{" "}
                                <strong className="font-mono font-semibold text-foreground print:text-black">#{order.orderNumber}</strong>
                            </p>

                            <p>
                                <span className="font-semibold text-foreground print:text-black">Issued Date:</span>{" "}
                                <time dateTime={new Date(order.createdAt).toISOString()}>{formattedDate}</time>
                            </p>
                        </div>
                    </div>
                </header>

                {/* Customer & Payment Meta Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-border/60 print:border-black/20">
                    {/* Billing Address Card */}
                    <div className="rounded-xl border border-border/50 bg-secondary/20 p-4 sm:p-5 space-y-2 print:border-black/20 print:bg-transparent">
                        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground print:text-black">
                            Billed To
                        </h2>

                        <div className="text-xs sm:text-sm space-y-0.5 text-foreground leading-relaxed print:text-black">
                            <p className="font-semibold text-base text-foreground print:text-black">{order.fullName}</p>
                            <p className="font-mono text-muted-foreground print:text-black">{order.phone}</p>
                            <p>{order.addressLine1}</p>
                            {order.addressLine2 && <p>{order.addressLine2}</p>}
                            <p>
                                {order.city}, {order.state} — <span className="font-mono">{order.postalCode}</span>
                            </p>
                            <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground pt-1 print:text-black">
                                {order.country}
                            </p>
                        </div>
                    </div>

                    {/* Payment Method Details */}
                    <div className="rounded-xl border border-border/50 bg-secondary/20 p-4 sm:p-5 space-y-3 print:border-black/20 print:bg-transparent">
                        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground print:text-black">
                            Payment Information
                        </h2>

                        <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between border-b border-border/30 pb-1.5 print:border-black/10">
                                <span className="text-muted-foreground print:text-black">Method</span>
                                <span className="font-medium text-foreground print:text-black">{order.paymentMethod}</span>
                            </div>

                            <div className="flex justify-between border-b border-border/30 pb-1.5 print:border-black/10">
                                <span className="text-muted-foreground print:text-black">Payment Status</span>
                                <span className="font-medium text-foreground print:text-black">{order.paymentStatus}</span>
                            </div>

                            <div className="flex justify-between border-b border-border/30 pb-1.5 print:border-black/10">
                                <span className="text-muted-foreground print:text-black">Fulfillment</span>
                                <span className="font-medium text-foreground print:text-black">{order.status}</span>
                            </div>

                            {order.razorpayPaymentId && (
                                <div className="flex justify-between gap-4 pt-0.5">
                                    <span className="text-muted-foreground shrink-0 print:text-black">Txn ID</span>
                                    <span className="font-mono text-[11px] break-all text-right text-foreground print:text-black">
                                        {order.razorpayPaymentId}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Itemized Table */}
                <div className="py-6 sm:py-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/80 text-[11px] font-mono uppercase tracking-wider text-muted-foreground print:border-black print:text-black">
                                <th className="py-3 pr-4 font-semibold">Product Description</th>
                                <th className="py-3 px-2 sm:px-4 font-semibold text-center">Qty</th>
                                <th className="py-3 px-2 sm:px-4 font-semibold text-right">Unit Price</th>
                                <th className="py-3 pl-2 sm:pl-4 font-semibold text-right">Subtotal</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border/40 text-xs sm:text-sm print:divide-black/10">
                            {order.items.map((item) => {
                                const itemSubtotal = item.price * item.quantity;

                                return (
                                    <tr key={item.id} className="hover:bg-secondary/10 transition-colors print:hover:bg-transparent">
                                        <td className="py-4 pr-4">
                                            <p className="font-semibold text-foreground print:text-black">{item.title}</p>
                                            {item.sku && (
                                                <p className="text-[11px] font-mono text-muted-foreground print:text-black/70">
                                                    SKU: {item.sku}
                                                </p>
                                            )}
                                        </td>

                                        <td className="py-4 px-2 sm:px-4 text-center font-mono font-medium text-foreground print:text-black">
                                            {item.quantity}
                                        </td>

                                        <td className="py-4 px-2 sm:px-4 text-right font-mono text-foreground print:text-black">
                                            {formatCurrency(item.price, currency)}
                                        </td>

                                        <td className="py-4 pl-2 sm:pl-4 text-right font-mono font-semibold text-foreground print:text-black">
                                            {formatCurrency(itemSubtotal, currency)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end pt-4 border-t border-border/60 print:border-black/20 break-inside-avoid">
                    <div className="w-full max-w-xs space-y-2.5 text-xs sm:text-sm">
                        <div className="flex justify-between text-muted-foreground print:text-black">
                            <span>Subtotal</span>
                            <span className="font-mono text-foreground print:text-black">
                                {formatCurrency(order.subtotal, currency)}
                            </span>
                        </div>

                        <div className="flex justify-between text-muted-foreground print:text-black">
                            <span>Shipping</span>
                            <span className="font-mono text-foreground print:text-black">
                                {order.shipping === 0 ? "Free" : formatCurrency(order.shipping, currency)}
                            </span>
                        </div>

                        {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 print:text-black">
                                <span className="inline-flex items-center gap-1.5">
                                    <span>Discount</span>
                                    {order.coupon && (
                                        <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-semibold border border-emerald-600/30">
                                            {order.coupon.code}
                                        </span>
                                    )}
                                </span>
                                <span className="font-mono">
                                    -{formatCurrency(order.discount, currency)}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between text-muted-foreground print:text-black">
                            <span>Estimated Tax</span>
                            <span className="font-mono text-foreground print:text-black">
                                {formatCurrency(order.tax, currency)}
                            </span>
                        </div>

                        <div className="my-2 border-t border-border/60 print:border-black/20" />

                        <div className="flex justify-between pt-1 text-base sm:text-lg font-bold text-foreground print:text-black">
                            <span>Grand Total</span>
                            <span className="font-serif text-primary print:text-black">
                                {formatCurrency(order.total, currency)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 sm:mt-12 border-t border-border/60 pt-6 text-center space-y-1 print:border-black/20 print:mt-8">
                    <p className="text-xs sm:text-sm font-semibold text-foreground print:text-black">
                        Thank you for shopping with Furnitureables.
                    </p>
                    <p className="text-[11px] text-muted-foreground font-light print:text-black/70">
                        This is a computer-generated tax invoice and does not require a physical signature.
                    </p>
                </footer>
            </article>
        </div>
    );
}