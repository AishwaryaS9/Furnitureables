import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { Order } from "@/types/order";
import logo from "@/public/logo.svg";

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

interface InvoicePdfProps {
    order: Order;
}

const COLORS = {
    primary: "#111827",
    secondary: "#4B5563",
    muted: "#6B7280",
    lightBg: "#F9FAFB",
    border: "#E5E7EB",
    paidBg: "#DCFCE7",
    paidText: "#15803D",
    pendingBg: "#FEF3C7",
    pendingText: "#B45309",
};

const styles = StyleSheet.create({
    page: {
        padding: 36,
        fontSize: 10,
        fontFamily: "DejaVu",
        color: COLORS.primary,
        backgroundColor: "#FFFFFF",
    },

    // Header Section
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 16,
    },

    brandGroup: {
        maxWidth: 240,
    },

    logo: {
        width: 180,
        height: "auto",
        marginBottom: 6,
    },

    brandMeta: {
        marginTop: 8,
        fontSize: 8,
        color: COLORS.muted,
        lineHeight: 1.3,
    },

    invoiceMetaGroup: {
        alignItems: "flex-end",
    },

    invoiceHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },

    invoiceTitle: {
        fontSize: 22,
        fontFamily: "DejaVu",
        fontWeight: 700,
        color: COLORS.primary,
        letterSpacing: 2,
    },

    statusBadge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 4,
        fontSize: 8,
        fontFamily: "DejaVu",
        fontWeight: 700,
        textTransform: "uppercase",
    },

    invoiceDetailText: {
        fontSize: 9,
        color: COLORS.secondary,
        marginBottom: 2,
    },

    boldText: {
        fontFamily: "DejaVu",
        fontWeight: 700,
        color: COLORS.primary,
    },

    // Customer & Payment Grid Section
    sectionGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },

    columnBox: {
        width: "48%",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: COLORS.lightBg,
    },

    sectionHeading: {
        fontSize: 8,
        fontFamily: "DejaVu",
        fontWeight: 700,
        color: COLORS.muted,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 8,
    },

    columnContent: {
        fontSize: 9,
        color: COLORS.secondary,
        lineHeight: 1.4,
    },

    recipientName: {
        fontSize: 11,
        fontFamily: "DejaVu",
        fontWeight: 700,
        color: COLORS.primary,
        marginBottom: 3,
    },

    keyValRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 3,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    // Table Section
    table: {
        marginBottom: 24,
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: COLORS.lightBg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingVertical: 8,
        paddingHorizontal: 8,
        fontSize: 8,
        fontFamily: "DejaVu",
        fontWeight: 700,
        color: COLORS.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },

    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: "center",
    },

    colProduct: {
        width: "50%",
    },

    colQty: {
        width: "12%",
        textAlign: "center",
    },

    colPrice: {
        width: "18%",
        textAlign: "right",
    },

    colTotal: {
        width: "20%",
        textAlign: "right",
    },

    productTitle: {
        fontSize: 9,
        fontFamily: "DejaVu",
        fontWeight: 700,
        color: COLORS.primary,
    },

    productSku: {
        fontSize: 8,
        color: COLORS.muted,
        marginTop: 2,
    },

    // Summary Totals Section
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 24,
    },

    totalsBox: {
        width: 220,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: COLORS.lightBg,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        fontSize: 9,
        color: COLORS.secondary,
    },

    grandTotalRow: {
        marginTop: 6,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        fontSize: 11,
        fontFamily: "DejaVu",
        fontWeight: 700,
        color: COLORS.primary,
    },

    // Footer Section
    footer: {
        marginTop: "auto",
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 12,
        alignItems: "center",
    },

    footerTitle: {
        fontSize: 9,
        fontFamily: "DejaVu",
        fontWeight: 700,
        color: COLORS.primary,
        marginBottom: 3,
    },

    footerSubtitle: {
        fontSize: 8,
        color: COLORS.muted,
    },
});

// Currency formatter
function formatPdfCurrency(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toFixed(2)}`;
    }
}

export default function InvoicePdf({ order }: InvoicePdfProps) {
    const isPaid = order.paymentStatus === "PAID";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Block */}
                <View style={styles.header}>
                    <View style={styles.brandGroup}>
                        <Image
                            src={logo.src}
                            style={styles.logo}
                        />

                        <View style={styles.brandMeta}>
                            <Text>support@furnitureables.com</Text>
                            <Text>https://furnitureables-store.vercel.app</Text>
                        </View>
                    </View>

                    <View style={styles.invoiceMetaGroup}>
                        <View style={styles.invoiceHeaderRow}>
                            <Text style={styles.invoiceTitle}>
                                INVOICE
                            </Text>

                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor: isPaid
                                            ? COLORS.paidBg
                                            : COLORS.pendingBg,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: isPaid
                                            ? COLORS.paidText
                                            : COLORS.pendingText,
                                    }}
                                >
                                    {order.paymentStatus}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.invoiceDetailText}>
                            Invoice No:{" "}
                            <Text style={styles.boldText}>
                                #{order.orderNumber}
                            </Text>
                        </Text>

                        <Text style={styles.invoiceDetailText}>
                            Issued Date:{" "}
                            <Text style={styles.boldText}>
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString("en-IN")}
                            </Text>
                        </Text>
                    </View>
                </View>

                {/* Billed To & Payment Meta */}
                <View style={styles.sectionGrid}>
                    {/* Billing */}
                    <View style={styles.columnBox}>
                        <Text style={styles.sectionHeading}>
                            Billed To
                        </Text>

                        <View style={styles.columnContent}>
                            <Text style={styles.recipientName}>
                                {order.fullName}
                            </Text>

                            <Text style={{ marginBottom: 2 }}>
                                {order.phone}
                            </Text>

                            <Text>{order.addressLine1}</Text>

                            {order.addressLine2 ? (
                                <Text>{order.addressLine2}</Text>
                            ) : null}

                            <Text>
                                {order.city}, {order.state} -{" "}
                                {order.postalCode}
                            </Text>

                            <Text
                                style={{
                                    fontFamily: "DejaVu",
                                    fontWeight: 700,
                                    marginTop: 2,
                                }}
                            >
                                {order.country}
                            </Text>
                        </View>
                    </View>

                    {/* Payment Details */}
                    <View style={styles.columnBox}>
                        <Text style={styles.sectionHeading}>
                            Payment Details
                        </Text>

                        <View style={styles.columnContent}>
                            <View style={styles.keyValRow}>
                                <Text style={{ color: COLORS.muted }}>
                                    Method
                                </Text>

                                <Text style={styles.boldText}>
                                    {order.paymentMethod}
                                </Text>
                            </View>

                            <View style={styles.keyValRow}>
                                <Text style={{ color: COLORS.muted }}>
                                    Payment Status
                                </Text>

                                <Text style={styles.boldText}>
                                    {order.paymentStatus}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.keyValRow,
                                    { borderBottomWidth: 0 },
                                ]}
                            >
                                <Text style={{ color: COLORS.muted }}>
                                    Fulfillment
                                </Text>

                                <Text style={styles.boldText}>
                                    {order.status}
                                </Text>
                            </View>

                            {order.razorpayPaymentId ? (
                                <View
                                    style={[
                                        styles.keyValRow,
                                        {
                                            borderBottomWidth: 0,
                                            marginTop: 4,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: COLORS.muted,
                                        }}
                                    >
                                        Txn ID
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 7,
                                            fontFamily: "DejaVu",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {order.razorpayPaymentId}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </View>

                {/* Line Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.colProduct}>
                            Product Description
                        </Text>

                        <Text style={styles.colQty}>
                            Qty
                        </Text>

                        <Text style={styles.colPrice}>
                            Unit Price
                        </Text>

                        <Text style={styles.colTotal}>
                            Subtotal
                        </Text>
                    </View>

                    {order.items.map((item, index) => {
                        const itemTotal =
                            item.price * item.quantity;

                        return (
                            <View
                                key={item.id || index}
                                style={[
                                    styles.tableRow,
                                    {
                                        backgroundColor:
                                            index % 2 === 0
                                                ? "#FFFFFF"
                                                : COLORS.lightBg,
                                    },
                                ]}
                            >
                                <View style={styles.colProduct}>
                                    <Text style={styles.productTitle}>
                                        {item.title}
                                    </Text>

                                    {item.sku ? (
                                        <Text style={styles.productSku}>
                                            SKU: {item.sku}
                                        </Text>
                                    ) : null}
                                </View>

                                <Text style={styles.colQty}>
                                    {item.quantity}
                                </Text>

                                <Text style={styles.colPrice}>
                                    {formatPdfCurrency(
                                        item.price,
                                        order.currency
                                    )}
                                </Text>

                                <Text
                                    style={[
                                        styles.colTotal,
                                        styles.boldText,
                                    ]}
                                >
                                    {formatPdfCurrency(
                                        itemTotal,
                                        order.currency
                                    )}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Summary Totals */}
                <View style={styles.summaryContainer}>
                    <View style={styles.totalsBox}>
                        {/* Subtotal */}
                        <View style={styles.totalRow}>
                            <Text
                                style={{
                                    color: COLORS.muted,
                                }}
                            >
                                Subtotal
                            </Text>

                            <Text style={styles.boldText}>
                                {formatPdfCurrency(
                                    order.subtotal,
                                    order.currency
                                )}
                            </Text>
                        </View>

                        {/* Shipping */}
                        <View style={styles.totalRow}>
                            <Text
                                style={{
                                    color: COLORS.muted,
                                }}
                            >
                                Shipping
                            </Text>

                            <Text style={styles.boldText}>
                                {order.shipping === 0
                                    ? "Free"
                                    : formatPdfCurrency(
                                        order.shipping,
                                        order.currency
                                    )}
                            </Text>
                        </View>

                        {/* Discount */}
                        {order.discount > 0 ? (
                            <View style={styles.totalRow}>
                                <Text
                                    style={{
                                        color: COLORS.paidText,
                                    }}
                                >
                                    Discount
                                    {order.coupon
                                        ? ` (${order.coupon.code})`
                                        : ""}
                                </Text>

                                <Text
                                    style={{
                                        color: COLORS.paidText,
                                        fontFamily: "DejaVu",
                                        fontWeight: 700,
                                    }}
                                >
                                    -
                                    {formatPdfCurrency(
                                        order.discount,
                                        order.currency
                                    )}
                                </Text>
                            </View>
                        ) : null}

                        {/* Tax */}
                        <View style={styles.totalRow}>
                            <Text
                                style={{
                                    color: COLORS.muted,
                                }}
                            >
                                Estimated Tax
                            </Text>

                            <Text style={styles.boldText}>
                                {formatPdfCurrency(
                                    order.tax,
                                    order.currency
                                )}
                            </Text>
                        </View>

                        {/* Grand Total */}
                        <View
                            style={[
                                styles.totalRow,
                                styles.grandTotalRow,
                            ]}
                        >
                            <Text>Grand Total</Text>

                            <Text>
                                {formatPdfCurrency(
                                    order.total,
                                    order.currency
                                )}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>
                        Thank you for shopping with Furnitureables.
                    </Text>

                    <Text style={styles.footerSubtitle}>
                        This is a computer-generated tax invoice and does
                        not require a physical signature.
                    </Text>
                </View>
            </Page>
        </Document>
    );
}