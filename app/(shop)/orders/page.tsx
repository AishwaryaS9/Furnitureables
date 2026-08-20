import { Metadata } from "next";
import EmptyOrders from "@/components/orders/EmptyOrders";
import OrdersFeed from "@/components/orders/OrdersFeed";
import BreadcrumbNavigation from "@/components/common/BreadcrumbNavigation";
import { GET_ORDERS } from "@/lib/graphql/queries";
import { graphqlServerClient } from "@/lib/graphql/server-client";
import { OrdersResponse } from "@/types/graphql";
import { Package, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "My Orders & Purchase History",
    description:
        "Track active dispatch statuses, inspect architectural order details, and manage purchase history.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function OrdersPage() {
    const client = await graphqlServerClient();
    const { orders } = await client.request<OrdersResponse>(GET_ORDERS);

    if (!orders || !orders.length) {
        return <EmptyOrders />;
    }

    const orderCount = orders.length;

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background focus:outline-none"
        >
            <section
                aria-labelledby="orders-page-heading"
                className="mx-auto max-w-360 px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8"
            >
                <BreadcrumbNavigation value="Orders" />

                {/* Editorial Header Block */}
                <header className="mb-8 sm:mb-12 border-b border-border/60 pb-6 sm:pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary border border-border/60 text-primary shrink-0">
                                <Package className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                Order History
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-[11px] font-mono text-muted-foreground">
                            <ShieldCheck
                                className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                                aria-hidden="true"
                            />
                            <span>Verified Purchases</span>
                        </div>
                    </div>

                    <h1
                        id="orders-page-heading"
                        className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-foreground"
                    >
                        My Orders
                    </h1>

                    <p className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                        Monitor real-time dispatch progress, review itemized receipts, and inspect historical order archives.
                    </p>
                </header>

                {/* Section Toolbar & Paginated Feed */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h2
                                id="order-list-heading"
                                className="text-lg sm:text-xl font-serif font-normal tracking-tight text-foreground"
                            >
                                Purchase History
                            </h2>
                            <span className="text-[11px] font-mono font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border/50 shrink-0">
                                {orderCount} {orderCount === 1 ? "Order" : "Orders"}
                            </span>
                        </div>
                    </div>

                    {/* Paginated Orders Feed */}
                    <OrdersFeed orders={orders} />
                </div>
            </section>
        </main>
    );
}