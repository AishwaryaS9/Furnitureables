import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/mailer";
import { renderInvoiceEmailHtml, renderInvoiceEmailText } from "@/lib/email/templates/invoiceEmail";
import { renderInvoicePdfBuffer } from "./renderInvoicePdf";
import { Order } from "@/types/order";

type OrderWithRelations = Awaited<ReturnType<typeof loadOrderWithRelations>>;

async function loadOrderWithRelations(orderId: string) {
    return prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
            coupon: true,
            user: true,
        },
    });
}

function toInvoiceOrder(order: NonNullable<OrderWithRelations>): Order {
    return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        coupon: order.coupon ? { code: order.coupon.code } : null,
        razorpayPaymentId: order.razorpayPaymentId,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        currency: order.currency,
        fullName: order.fullName,
        phone: order.phone,
        addressLine1: order.addressLine1,
        addressLine2: order.addressLine2 ?? undefined,
        city: order.city,
        state: order.state,
        postalCode: order.postalCode,
        country: order.country,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
            id: item.id,
            title: item.title,
            image: item.image ?? undefined,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
        })),
    };
}

function getAppUrl() {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export async function sendOrderInvoiceEmail(orderId: string): Promise<void> {
    console.log('OrderID-EMAIL', orderId)
    try {
        const orderWithRelations = await loadOrderWithRelations(orderId);

        if (!orderWithRelations) {
            console.error(`[invoice-email] Order ${orderId} not found; skipping email.`);
            return;
        }

        const recipientEmail = orderWithRelations.user?.email;
        if (!recipientEmail) {
            console.error(`[invoice-email] Order ${orderId} has no recipient email; skipping.`);
            return;
        }

        const order = toInvoiceOrder(orderWithRelations);
        const customerName =
            [orderWithRelations.user?.firstName, orderWithRelations.user?.lastName]
                .filter(Boolean)
                .join(" ")
                .trim() || order.fullName;

        const [pdfBuffer, logoAttachment] = await Promise.all([
            renderInvoicePdfBuffer(order),
            loadLogoAttachment(),
        ]);

        const emailParams = {
            customerName,
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
                title: item.title,
                sku: item.sku,
                quantity: item.quantity,
                price: item.price,
            })),
            subtotal: order.subtotal,
            shipping: order.shipping,
            tax: order.tax,
            discount: order.discount,
            couponCode: order.coupon?.code,
            total: order.total,
            currency: order.currency,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            fulfillmentStatus: order.status,
            shippingAddress: {
                addressLine1: order.addressLine1,
                addressLine2: order.addressLine2,
                city: order.city,
                state: order.state,
                postalCode: order.postalCode,
                country: order.country,
            },
            orderUrl: `${getAppUrl()}/orders/${order.id}`,
            supportEmail: process.env.SMTP_SUPPORT_EMAIL || "support@furnitureables.com",
            logoCid: logoAttachment ? "brand-logo" : undefined,
        };

        const html = renderInvoiceEmailHtml(emailParams);
        const text = renderInvoiceEmailText(emailParams);

        await sendEmail({
            to: recipientEmail,
            subject: `Your Furnitureables invoice — Order #${order.orderNumber}`,
            html,
            text,
            attachments: [
                ...(logoAttachment ? [logoAttachment] : []),
                {
                    filename: `invoice-${order.orderNumber}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });
    } catch (error) {
        console.error(`[invoice-email] Failed to send invoice email for order ${orderId}:`, error);
    }
}

async function loadLogoAttachment() {
    try {
        const logoPath = path.join(process.cwd(), "public", "logo.svg");
        const content = fs.readFileSync(logoPath);
        return {
            filename: "logo.svg",
            content,
            contentType: "image/svg+xml",
            cid: "brand-logo",
        };
    } catch (error) {
        console.error("[invoice-email] Failed to load logo attachment:", error);
        return null;
    }
}





