"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink, Font } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvoicePdf from "./pdf/InvoicePdf";
import { Order } from "@/types/order";

interface Props {
    order: Order;
}

export default function DownloadInvoiceButton({ order }: Props) {
    const [isClient, setIsClient] = useState(false);
    const [fontsReady, setFontsReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function registerFonts() {
            try {
                console.log(
                    "[invoice-download] Registering browser fonts..."
                );

                Font.register({
                    family: "DejaVu",
                    fonts: [
                        {
                            src: "/fonts/DejaVuSans.ttf",
                            fontWeight: 400,
                        },
                        {
                            src: "/fonts/DejaVuSans-Bold.ttf",
                            fontWeight: 700,
                        },
                    ],
                });

                if (mounted) {
                    setFontsReady(true);
                }
            } catch (error) {
                console.error("Failed to register fonts:", error);
            }
        }

        setIsClient(true);
        registerFonts();

        return () => {
            mounted = false;
        };
    }, []);

    if (!isClient || !fontsReady) {
        return (
            <Button
                type="button"
                variant="default"
                size="sm"
                disabled
                className="h-9 px-4 text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
            >
                <Loader2
                    className="h-3.5 w-3.5 animate-spin shrink-0"
                    aria-hidden="true"
                />

                <span>
                    {!isClient
                        ? "Preparing PDF..."
                        : "Loading fonts..."}
                </span>
            </Button>
        );
    }

    return (
        <PDFDownloadLink
            document={<InvoicePdf order={order} />}
            fileName={`Invoice-${order.orderNumber}.pdf`}
            className="inline-flex"
        >
            {({ loading, error }) => {
                if (error) {
                    console.error("PDF generation error:", error);
                }

                return (
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
                                <Loader2
                                    className="h-3.5 w-3.5 animate-spin shrink-0"
                                    aria-hidden="true"
                                />

                                <span>
                                    Generating PDF...
                                </span>
                            </>
                        ) : (
                            <>
                                <Download
                                    className="h-3.5 w-3.5 shrink-0"
                                    aria-hidden="true"
                                />

                                <span>
                                    Download Invoice
                                </span>
                            </>
                        )}
                    </Button>
                );
            }}
        </PDFDownloadLink>
    );
}


