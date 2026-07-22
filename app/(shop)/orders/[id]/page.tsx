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

export default async function OrderPage({
    params,
}: Props) {
    const { id } = await params;

    const client = await graphqlServerClient();

    const { order } = await client.request<OrderResponse>(GET_ORDER, { id });

    if (!order) {
        notFound();
    }

    return (
        <section className="container mx-auto max-w-6xl py-10">
            <OrderDetails order={order} />
        </section>
    );
}