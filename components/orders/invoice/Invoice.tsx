import Link from "next/link";
import { Order } from "@/types/order";
import DownloadInvoiceButton from "./DownloadInvoiceButton";

interface InvoiceProps {
    order: Order;
}

export default function Invoice({ order }: InvoiceProps) {
    return (
        <>
            <div className="mb-6 flex justify-end print:hidden">
                <DownloadInvoiceButton order={order} />
            </div>

            <div className="rounded-xl border bg-card p-8 shadow-sm print:border-0 print:shadow-none">
                {/* Header */}
                <div className="flex items-start justify-between border-b pb-8">
                    <div>
                        <Link
                            href="/"
                            className="text-3xl font-serif font-bold tracking-tight text-primary"
                        >
                            Furniture
                            <span className="font-sans text-muted-foreground">ables</span>
                        </Link>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Premium Furniture for Modern Living
                        </p>

                        <div className="mt-4 text-sm space-y-1">
                            <p>support@furnitureables.com</p>
                            <p>www.furnitureables.com</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <h2 className="text-4xl font-bold tracking-widest text-primary">
                            INVOICE
                        </h2>
                        {order.paymentStatus === "PAID" && (
                            <div className="mt-4 inline-block rounded-md border border-green-600 bg-green-50 px-4 py-1 text-sm font-semibold text-green-700">
                                PAID
                            </div>
                        )}
                        <div className="mt-6 space-y-1 text-sm">
                            <p>
                                <span className="font-semibold">Invoice #</span>{" "}
                                {order.orderNumber}
                            </p>

                            <p>
                                <span className="font-semibold">Date</span>{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customer */}
                <div className="grid gap-6 py-8 md:grid-cols-2">
                    {/* Billing */}
                    <div className="rounded-lg border p-5">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Billing Address
                        </h3>

                        <div className="space-y-1 text-sm leading-6">
                            <p className="font-semibold text-base">{order.fullName}</p>

                            <p>{order.phone}</p>

                            <p>{order.addressLine1}</p>

                            {order.addressLine2 && <p>{order.addressLine2}</p>}

                            <p>
                                {order.city}, {order.state}
                            </p>

                            <p>{order.postalCode}</p>

                            <p>{order.country}</p>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-lg border p-5">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Payment Details
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Method</span>
                                <span className="font-medium">{order.paymentMethod}</span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Payment Status</span>
                                <span className="font-medium">{order.paymentStatus}</span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Order Status</span>
                                <span className="font-medium">{order.status}</span>
                            </div>

                            {order.razorpayPaymentId && (
                                <div className="flex justify-between gap-4 border-b pb-2">
                                    <span className="text-muted-foreground shrink-0">
                                        Transaction ID
                                    </span>

                                    <span className="font-mono text-xs break-all text-right">
                                        {order.razorpayPaymentId}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="py-8">
                    <table className="w-full overflow-hidden rounded-lg border">
                        <thead className="bg-muted/50">
                            <tr className="text-left text-sm uppercase tracking-wide">
                                <th className="py-3">Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {order.items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t"
                                >
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="font-medium">{item.title}</p>

                                            <p className="text-xs text-muted-foreground">
                                                SKU: {item.sku}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">{item.quantity}</td>

                                    <td className="px-4 py-4">
                                        ₹{item.price.toFixed(2)}
                                    </td>

                                    <td className="text-right px-4 py-4">
                                        ₹
                                        {(
                                            item.price * item.quantity
                                        ).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="ml-auto mt-8 max-w-sm rounded-lg border bg-muted/30 p-6">
                    <div className="space-y-4 text-sm">

                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{order.subtotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{order.shipping.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="flex items-center gap-2">
                                Discount

                                {order.coupon && (
                                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                        {order.coupon.code}
                                    </span>
                                )}
                            </span>

                            <span>
                                -₹{order.discount.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>₹{order.tax.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between border-t pt-5 text-xl font-bold">
                            <span>Total</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 border-t pt-8 text-center">
                    <p className="text-sm font-medium">
                        Thank you for shopping with Furnitureables.
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                        This is a computer-generated invoice and does not require a signature.
                    </p>
                </div>
            </div>
        </>
    );
}