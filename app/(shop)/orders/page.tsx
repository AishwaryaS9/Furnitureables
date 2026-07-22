import EmptyOrders from "@/components/orders/EmptyOrders";
import OrderCard from "@/components/orders/OrderCard";
import { GET_ORDERS } from "@/lib/graphql/queries";
import { graphqlServerClient } from "@/lib/graphql/server-client";
import { OrdersResponse } from "@/types/graphql";

export default async function OrdersPage() {
    const client = await graphqlServerClient();

    const { orders } = await client.request<OrdersResponse>(GET_ORDERS);

    if (!orders.length) {
        return <EmptyOrders />;
    }

    return (
        <section className="container mx-auto max-w-6xl py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    My Orders
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Track your orders and view your purchase history.
                </p>
            </div>

            <div className="space-y-5">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                    />
                ))}
            </div>
        </section>
    );
}