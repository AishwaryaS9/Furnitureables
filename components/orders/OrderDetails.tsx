import OrderHeader from "./details/OrderHeader";
import OrderItems from "./details/OrderItems";
import OrderSummary from "./details/OrderSummary";
import ShippingAddress from "./details/ShippingAddress";
import OrderTimeline from "./details/OrderTimeline";
import OrderActions from "./details/OrderActions";
import { Order } from "@/types/order";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
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
            "orderItem": order.items.map((item) => ({
              "@type": "OrderItem",
              "name": item.title,
              "image": item.image,
              "orderQuantity": item.quantity,
              "itemPrice": item.price,
            })),
          }),
        }}
      />

      <article
        aria-labelledby="order-details-title"
        className="space-y-6 sm:space-y-8 lg:space-y-10"
      >
        {/* Order Meta Header & Status */}
        <section aria-label="Order Status Header">
          <OrderHeader order={order} />
        </section>

        {/* Fulfillment Timeline Progress */}
        <section aria-label="Order Fulfillment Tracking Timeline">
          <OrderTimeline order={order} />
        </section>

        {/* Action Toolbar (Invoices, Support, Cancel, Reorder) */}
        <section aria-label="Order Actions and Downloads">
          <OrderActions order={order} />
        </section>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
          {/* Purchased Items & Delivery Destination */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-8">
            <section aria-label="Purchased Item Manifest">
              <OrderItems items={order.items} />
            </section>

            <section aria-label="Delivery Destination and Shipping Details">
              <ShippingAddress order={order} />
            </section>
          </div>

          {/* Sticky Financial Order Summary Ledger */}
          <aside
            aria-label="Order Payment Summary and Totals"
            className="lg:sticky lg:top-24 lg:col-span-4"
          >
            <OrderSummary order={order} />
          </aside>
        </div>
      </article>
    </>
  );
}