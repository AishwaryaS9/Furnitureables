import { cn } from "@/lib/utils";
import { getPaymentStatusColor } from "@/lib/order";

interface Props {
    status:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";
}

export default function PaymentStatusBadge({
    status,
}: Props) {
    return (
        <>
            <h3 className="text-sm text-muted-foreground">Payment Status:</h3>
            <span
                className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                    getPaymentStatusColor(status)
                )}
            >
                {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
        </>
    );
}