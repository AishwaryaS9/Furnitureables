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

export default function OrderDetails({
  order,
}: OrderDetailsProps) {
  return (
    <div className="space-y-8">
      <OrderHeader order={order} />
      <OrderTimeline order={order} />
      <OrderActions order={order} />
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <OrderItems items={order.items} />

          <ShippingAddress order={order} />
        </div>

        <div>
          <OrderSummary order={order} />
        </div>
      </div>
    </div>
  );
}