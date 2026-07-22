import { cn } from "@/lib/utils";

interface Props {
    status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
}

const statusStyles = {
    PENDING:
        "bg-yellow-100 text-yellow-800 border-yellow-200",

    CONFIRMED:
        "bg-blue-100 text-blue-800 border-blue-200",

    SHIPPED:
        "bg-purple-100 text-purple-800 border-purple-200",

    DELIVERED:
        "bg-green-100 text-green-800 border-green-200",

    CANCELLED:
        "bg-red-100 text-red-800 border-red-200",
};

export default function OrderStatusBadge({
    status,
}: Props) {
    return (
        <>
            <h3 className="text-sm text-muted-foreground">Order Status:</h3>
            <span
                className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                    statusStyles[status]
                )}
            >
                {status}
            </span>
        </>
    );
}