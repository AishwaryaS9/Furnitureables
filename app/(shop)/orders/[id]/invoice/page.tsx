import { notFound } from "next/navigation";
import { graphqlServerClient } from "@/lib/graphql/server-client";
import { GET_ORDER } from "@/lib/graphql/queries";
import { OrderResponse } from "@/types/graphql";
import Invoice from "@/components/orders/invoice/Invoice";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoicePage({ params }: Props) {
  const { id } = await params;

  const client = await graphqlServerClient();

  const { order } = await client.request<OrderResponse>(GET_ORDER, { id });

  if (!order) {
    notFound();
  }

  return (
    <section className="container mx-auto max-w-5xl py-10">
      <Invoice order={order} />
    </section>
  );
}