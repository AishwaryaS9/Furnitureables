import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GET_ORDER } from "@/lib/graphql/queries";
import { OrderResponse } from "@/types/graphql";
import { graphqlServerClient } from "@/lib/graphql/server-client";
import OrderDetails from "@/components/orders/OrderDetails";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    try {
        const client = await graphqlServerClient();
        const { order } = await client.request<OrderResponse>(GET_ORDER, { id });

        if (!order) {
            return {
                title: "Order Not Found",
            };
        }

        return {
            title: `Order #${order.orderNumber} Details`,
            description: `View dispatch tracking, itemized receipt, and billing summary for Order #${order.orderNumber}.`,
            robots: {
                index: false,
                follow: false,
            },
        };
    } catch {
        return {
            title: "Order Details",
            robots: {
                index: false,
                follow: false,
            },
        };
    }
}

export default async function OrderPage({ params }: Props) {
    const { id } = await params;

    const client = await graphqlServerClient();
    const { order } = await client.request<OrderResponse>(GET_ORDER, { id });

    if (!order) {
        notFound();
    }

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background focus:outline-none"
        >
            <section
                aria-labelledby="order-details-page-heading"
                className="mx-auto max-w-360 px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8"
            >
                <OrderDetails order={order} />
            </section>
        </main>
    );
}