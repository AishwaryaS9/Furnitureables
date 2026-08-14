import { cn } from "@/lib/utils";
import { getPaymentStatusColor } from "@/lib/order";
import { Badge } from "@/components/ui/badge";
import { PaymentStatusFilter } from "@/types/order";

interface Props {
    status: PaymentStatusFilter;
    showLabel?: boolean;
    className?: string;
}

export default function PaymentStatusBadge({ status, showLabel = false, className }: Props) {
    const formattedStatus = status.charAt(0) + status.slice(1).toLowerCase();

    return (
        <div className="inline-flex items-center gap-1.5">
            {showLabel && <span className="text-xs font-medium text-muted-foreground">Payment:</span>}
            <Badge
                variant="outline"
                aria-label={`Payment status: ${formattedStatus}`}
                className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium border transition-colors",
                    getPaymentStatusColor(status),
                    className
                )}
            >
                {formattedStatus}
            </Badge>
        </div>
    );
}