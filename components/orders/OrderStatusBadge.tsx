import { cn } from "@/lib/utils";
import { getOrderStatusColor } from "@/lib/order";

interface Props {
    status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
}

export default function OrderStatusBadge({
    status,
}: Props) {
    return (
        <>
            <h3 className="text-sm text-muted-foreground">Order Status:</h3>
            <span
                className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                    getOrderStatusColor(status)
                )}
            >
                {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
        </>
    );
}