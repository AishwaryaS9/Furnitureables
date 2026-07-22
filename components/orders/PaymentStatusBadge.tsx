import { cn } from "@/lib/utils";

interface Props {
    status:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";
}

const styles = {
    PENDING:
        "bg-yellow-100 text-yellow-800 border-yellow-200",

    PAID:
        "bg-green-100 text-green-800 border-green-200",

    FAILED:
        "bg-red-100 text-red-800 border-red-200",

    REFUNDED:
        "bg-slate-100 text-slate-700 border-slate-200",
};

export default function PaymentStatusBadge({
    status,
}: Props) {
    return (
        <>
            <h3 className="text-sm text-muted-foreground">Payment Status:</h3>
            <span
                className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                    styles[status]
                )}
            >
                {status}
            </span>
        </>
    );
}