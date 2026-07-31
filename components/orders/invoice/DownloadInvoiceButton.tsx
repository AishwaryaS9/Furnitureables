"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import InvoicePdf from "./pdf/InvoicePdf";
import { Order } from "@/types/order";

interface Props {
    order: Order;
}

export default function DownloadInvoiceButton({ order }: Props) {
    return (
        <PDFDownloadLink
            document={<InvoicePdf order={order} />}
            fileName={`Invoice-${order.orderNumber}.pdf`}
        >
            {({ loading }) => (
                <Button disabled={loading}>
                    {loading ? "Generating PDF..." : "Download Invoice"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}