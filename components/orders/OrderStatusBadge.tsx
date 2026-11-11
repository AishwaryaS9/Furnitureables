import { cn } from "@/lib/utils";
import { formatOrderStatus, getOrderStatusColor } from "@/lib/order";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { OrderStatusFilter } from "@/types/order";

interface Props {
    status: OrderStatusFilter;
    showLabel?: boolean;
    className?: string;
}

function renderStatusIcon(status: Props["status"]) {
    switch (status) {
        case "PENDING":
            return <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />;
        case "CONFIRMED":
            return <CheckCircle2 className="h-3 w-3" />;
        case "SHIPPED":
        case "IN_TRANSIT":
            return <Truck className="h-3 w-3" />;
        case "OUT_FOR_DELIVERY":
            return <MapPin className="h-3 w-3" />;
        case "DELIVERED":
            return <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />;
        case "CANCELLED":
            return <XCircle className="h-3 w-3" />;
        default:
            return null;
    }
}

export default function OrderStatusBadge({ status, showLabel = false, className }: Props) {
    const formattedStatus = formatOrderStatus(status);

    return (
        <div className="inline-flex items-center gap-1.5">
            {showLabel && <span className="text-xs font-medium text-muted-foreground">Order:</span>}
            <Badge
                variant="outline"
                aria-label={`Order status: ${formattedStatus}`}
                className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-normal border transition-colors",
                    getOrderStatusColor(status),
                    className
                )}
            >
                {renderStatusIcon(status)}
                <span>{formattedStatus}</span>
            </Badge>
        </div>
    );
}