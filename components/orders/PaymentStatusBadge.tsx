import { cn } from "@/lib/utils";
import { getPaymentStatusColor } from "@/lib/order";
import { Badge } from "@/components/ui/badge";

interface Props {
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
}

export default function PaymentStatusBadge({ status }: Props) {
    const formattedStatus = status.charAt(0) + status.slice(1).toLowerCase();

    return (
        <div className="inline-flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Payment:</span>
            <Badge
                variant="outline"
                aria-label={`Payment status: ${formattedStatus}`}
                className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wider transition-colors",
                    getPaymentStatusColor(status)
                )}
            >
                {formattedStatus}
            </Badge>
        </div>
    );
}