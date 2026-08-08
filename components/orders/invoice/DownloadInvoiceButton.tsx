"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvoicePdf from "./pdf/InvoicePdf";
import { Order } from "@/types/order";

interface Props {
    order: Order;
}

export default function DownloadInvoiceButton({ order }: Props) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <Button
                type="button"
                variant="default"
                size="sm"
                disabled
                className="h-9 px-4 text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
            >
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden="true" />
                <span>Preparing PDF...</span>
            </Button>
        );
    }

    return (
        <PDFDownloadLink
            document={<InvoicePdf order={order} />}
            fileName={`Invoice-${order.orderNumber}.pdf`}
            className="inline-flex"
        >
            {({ loading }) => (
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={loading}
                    aria-label={`Download PDF tax invoice for order #${order.orderNumber}`}
                    className="h-9 px-4 text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden="true" />
                            <span>Generating PDF...</span>
                        </>
                    ) : (
                        <>
                            <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span>Download Invoice</span>
                        </>
                    )}
                </Button>
            )}
        </PDFDownloadLink>
    );
}