"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Order } from "@/types/order";

// @react-pdf/renderer is very large; only fetch it when the invoice is shown.
const DownloadInvoiceButton = dynamic(() => import("./DownloadInvoiceButton"), {
    ssr: false,
    loading: () => (
        <span
            role="status"
            className="inline-flex h-9 items-center gap-2 text-xs text-muted-foreground"
        >
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Preparing invoice…
        </span>
    ),
});

export default function LazyDownloadInvoiceButton({ order }: { order: Order }) {
    return <DownloadInvoiceButton order={order} />;
}
