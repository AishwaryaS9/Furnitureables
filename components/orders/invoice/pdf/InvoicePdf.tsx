import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Order } from "@/types/order";

interface InvoicePdfProps {
    order: Order;
}

const COLORS = {
    primary: "#8B5E3C",
    dark: "#111827",
    gray: "#6B7280",
    light: "#F9FAFB",
    border: "#E5E7EB",
    success: "#16A34A",
    warning: "#F59E0B",
};

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        color: "#111827",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
        borderBottom: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: 15,
    },

    brand: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.primary,
    },


    subtitle: {
        marginTop: 4,
        color: COLORS.gray,
        fontSize: 10,
    },
    invoiceTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: COLORS.dark,
    },

    section: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    column: {
        width: "47%",
        border: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        padding: 12,
        backgroundColor: COLORS.light,
    },

    heading: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 10,
    },

    row: {
        marginBottom: 4,
    },

    table: {
        marginTop: 30,
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginBottom: 6,
    },

    tableRow: {
        flexDirection: "row",
        borderBottom: 1,
        borderBottomColor: "#F3F4F6",
        paddingVertical: 8,
    },

    product: {
        width: "50%",
    },

    qty: {
        width: "15%",
        textAlign: "center",
    },

    price: {
        width: "15%",
        textAlign: "right",
    },

    total: {
        width: "20%",
        textAlign: "right",
    },

    totals: {
        marginTop: 25,
        marginLeft: "50%",
        border: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        padding: 14,
        backgroundColor: COLORS.light,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    grandTotal: {
        marginTop: 10,
        paddingTop: 10,
        borderTop: 1,
        borderTopColor: COLORS.border,
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.primary,
    },

    footer: {
        marginTop: 40,
        borderTop: 1,
        borderTopColor: "#E5E7EB",
        paddingTop: 15,
        textAlign: "center",
        color: "#6B7280",
        fontSize: 10,
    },
});

export default function InvoicePdf({
    order,
}: InvoicePdfProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                            <Text
                                style={{
                                    fontFamily: "Times-Bold",
                                    fontSize: 28,
                                    color: "#1A1A1A",
                                }}
                            >
                                Furniture
                            </Text>

                            <Text
                                style={{
                                    fontFamily: "Helvetica",
                                    fontSize: 28,
                                    color: "#6B7280",
                                }}
                            >
                                ables
                            </Text>
                        </View>
                        <Text style={styles.subtitle}>
                            Premium Furniture for Modern Living
                        </Text>
                    </View>

                    <View>
                        <Text style={styles.invoiceTitle}>
                            INVOICE
                        </Text>

                        <Text>
                            Invoice #{order.orderNumber}
                        </Text>
                        <View
                            style={{
                                marginTop: 8,
                                backgroundColor:
                                    order.paymentStatus === "PAID"
                                        ? "#DCFCE7"
                                        : "#FEF3C7",
                                paddingVertical: 4,
                                paddingHorizontal: 8,
                                borderRadius: 4,
                                alignSelf: "flex-end",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 9,
                                    fontWeight: "bold",
                                    color:
                                        order.paymentStatus === "PAID"
                                            ? "#166534"
                                            : "#92400E",
                                }}
                            >
                                {order.paymentStatus}
                            </Text>
                        </View>
                        <Text>
                            {new Date(order.createdAt).toLocaleDateString()}
                        </Text>
                    </View>

                </View>

                {/* Customer */}

                <View style={styles.section}>

                    <View style={styles.column}>
                        <Text style={styles.heading}>
                            Bill To
                        </Text>

                        <Text style={styles.row}>{order.fullName}</Text>
                        <Text style={styles.row}>{order.phone}</Text>
                        <Text style={styles.row}>{order.addressLine1}</Text>

                        {order.addressLine2 && (
                            <Text style={styles.row}>
                                {order.addressLine2}
                            </Text>
                        )}

                        <Text style={styles.row}>
                            {order.city}, {order.state}
                        </Text>

                        <Text style={styles.row}>
                            {order.postalCode}
                        </Text>

                        <Text style={styles.row}>
                            {order.country}
                        </Text>
                    </View>

                    <View style={styles.column}>

                        <Text style={styles.heading}>
                            Payment
                        </Text>

                        <Text style={styles.row}>
                            Method: {order.paymentMethod}
                        </Text>

                        <Text style={styles.row}>
                            Status: {order.paymentStatus}
                        </Text>

                        <Text style={styles.row}>
                            Order: {order.status}
                        </Text>

                    </View>

                </View>

                {/* Items */}

                <View style={styles.table}>

                    <View style={styles.tableHeader}>
                        <Text style={styles.product}>Product</Text>
                        <Text style={styles.qty}>Qty</Text>
                        <Text style={styles.price}>Price</Text>
                        <Text style={styles.total}>Total</Text>
                    </View>

                    {order.items.map((item, index) => (
                        <View
                            key={item.id}
                            style={[
                                styles.tableRow,
                                {
                                    backgroundColor:
                                        index % 2 === 0
                                            ? "#FFFFFF"
                                            : "#FAFAFA",
                                },
                            ]}
                        >
                            <Text style={styles.product}>
                                {item.title}
                            </Text>

                            <Text style={styles.qty}>
                                {item.quantity}
                            </Text>

                            <Text style={styles.price}>
                                ₹{item.price}
                            </Text>

                            <Text style={styles.total}>
                                ₹{item.price * item.quantity}
                            </Text>
                        </View>
                    ))}

                </View>

                {/* Totals */}

                <View style={styles.totals}>

                    <View style={styles.totalRow}>
                        <Text>Subtotal</Text>
                        <Text>₹{order.subtotal}</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text>Shipping</Text>
                        <Text>₹{order.shipping}</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text>
                            Discount
                            {order.coupon
                                ? ` (${order.coupon.code})`
                                : ""}
                        </Text>
                        <Text>-₹{order.discount}</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text>Tax</Text>
                        <Text>₹{order.tax}</Text>
                    </View>

                    <View
                        style={[
                            styles.totalRow,
                            styles.grandTotal,
                        ]}
                    >
                        <Text>Total</Text>
                        <Text>₹{order.total.toFixed(2)}</Text>
                    </View>

                </View>

                {/* Footer */}

                <View
                    style={{
                        marginTop: 40,
                        borderTop: 1,
                        borderTopColor: COLORS.border,
                        paddingTop: 15,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: "bold",
                            marginBottom: 6,
                        }}
                    >
                        Thank you for shopping with Furnitureables
                    </Text>

                    <Text
                        style={{
                            fontSize: 9,
                            color: COLORS.gray,
                        }}
                    >
                        This is a computer-generated invoice and does not require a signature.
                    </Text>
                </View>

            </Page>
        </Document>
    );
}