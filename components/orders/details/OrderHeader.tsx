import Link from "next/link";
import { ArrowLeft, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "../OrderStatusBadge";
import PaymentStatusBadge from "../PaymentStatusBadge";
import { formatOrderDate, getPaymentMethodLabel } from "@/lib/order";
import { Order } from "@/types/order";

interface OrderHeaderProps {
  order: Order;
}

export default function OrderHeader({ order }: OrderHeaderProps) {
  const formattedDate = formatOrderDate(order.createdAt);
  const paymentLabel = getPaymentMethodLabel(order.paymentMethod);

  return (
    <div className="space-y-4">
      {/* Back Link Wrapper */}
      <Link href="/orders" className="inline-block" aria-label="Back to orders page">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2.5 h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Back to Orders</span>
        </Button>
      </Link>

      {/* Main Header Container */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Metadata */}
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Order #{order.orderNumber}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <span>
                Placed on{" "}
                <time dateTime={new Date(order.createdAt).toISOString()}>
                  {formattedDate}
                </time>
              </span>
            </div>

            <span className="text-border" aria-hidden="true">•</span>

            <div className="inline-flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <span>
                Payment: <strong className="font-semibold text-foreground">{paymentLabel}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Status Badges Group */}
        <div
          className="flex items-center gap-2 flex-wrap"
          aria-label="Order and payment status"
        >
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>
    </div>
  );
}