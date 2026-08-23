import { InvoiceEmailParams } from "@/types/email";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderInvoiceEmailHtml(params: InvoiceEmailParams): string {
  const {
    customerName,
    orderNumber,
    createdAt,
    items,
    subtotal,
    shipping,
    tax,
    discount,
    couponCode,
    total,
    currency,
    paymentMethod,
    paymentStatus,
    fulfillmentStatus,
    shippingAddress,
    orderUrl,
    supportEmail,
    logoCid,
  } = params;

  const isPaid = paymentStatus === "PAID";
  const statusColor = isPaid ? "#15803D" : "#B45309";
  const statusBg = isPaid ? "#DCFCE7" : "#FEF3C7";

  const logoImg = logoCid
    ? `<img src="cid:${logoCid}" width="150" alt="Furnitureables" style="display:block;border:0;outline:none;text-decoration:none;height:auto;" />`
    : `<span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;letter-spacing:0.5px;color:#111827;">Furnitureables</span>`;

  const itemRows = items
    .map(
      (item) => `
              <tr>
                <td style="padding:14px 0;border-bottom:1px solid #E5E7EB;" valign="top">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#111827;">${escapeHtml(item.title)}</p>
                  ${item.sku ? `<p style="margin:2px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#6B7280;">SKU: ${escapeHtml(item.sku)}</p>` : ""}
                </td>
                <td style="padding:14px 0;border-bottom:1px solid #E5E7EB;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#4B5563;text-align:center;" valign="top">${item.quantity}</td>
                <td style="padding:14px 0;border-bottom:1px solid #E5E7EB;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#4B5563;text-align:right;" valign="top">${formatMoney(item.price, currency)}</td>
                <td style="padding:14px 0;border-bottom:1px solid #E5E7EB;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#111827;text-align:right;" valign="top">${formatMoney(item.price * item.quantity, currency)}</td>
              </tr>`
    )
    .join("");

  const discountRow =
    discount > 0
      ? `<tr>
                 <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#15803D;">Discount${couponCode ? ` (${escapeHtml(couponCode)})` : ""}</td>
                 <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#15803D;font-weight:700;text-align:right;">-${formatMoney(discount, currency)}</td>
               </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Your Furnitureables order #${escapeHtml(orderNumber)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F3F4F6;">
    <!-- Preheader (hidden preview text) -->
    <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#F3F4F6;opacity:0;">
      Your invoice for order #${escapeHtml(orderNumber)} is attached — thank you for shopping with Furnitureables.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB;">

            <!-- Header -->
            <tr>
              <td style="padding:32px 32px 24px;border-bottom:1px solid #E5E7EB;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="left" valign="middle">${logoImg}</td>
                    <td align="right" valign="middle">
                      <span style="display:inline-block;padding:5px 12px;border-radius:999px;background-color:${statusBg};color:${statusColor};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase;">${escapeHtml(paymentStatus)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding:28px 32px 4px;">
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;color:#111827;">Thanks for your order, ${escapeHtml(customerName)}!</h1>
                <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#4B5563;">
                  Your invoice for order <strong style="color:#111827;">#${escapeHtml(orderNumber)}</strong> placed on ${formatDate(createdAt)} is attached to this email as a PDF. Here's a quick summary below.
                </p>
              </td>
            </tr>

            <!-- Order meta -->
            <tr>
              <td style="padding:20px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;" width="50%" valign="top">
                      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6B7280;">Shipping To</p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#374151;">
                        ${escapeHtml(shippingAddress.addressLine1)}${shippingAddress.addressLine2 ? `<br />${escapeHtml(shippingAddress.addressLine2)}` : ""}<br />
                        ${escapeHtml(shippingAddress.city)}, ${escapeHtml(shippingAddress.state)} ${escapeHtml(shippingAddress.postalCode)}<br />
                        ${escapeHtml(shippingAddress.country)}
                      </p>
                    </td>
                    <td style="padding:16px 18px;" width="50%" valign="top">
                      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6B7280;">Payment</p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#374151;">
                        Method: <strong style="color:#111827;">${escapeHtml(paymentMethod)}</strong><br />
                        Status: <strong style="color:#111827;">${escapeHtml(paymentStatus)}</strong><br />
                        Fulfillment: <strong style="color:#111827;">${escapeHtml(fulfillmentStatus)}</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items -->
            <tr>
              <td style="padding:28px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr>
                      <th align="left" style="padding-bottom:10px;border-bottom:2px solid #111827;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6B7280;">Item</th>
                      <th align="center" style="padding-bottom:10px;border-bottom:2px solid #111827;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6B7280;">Qty</th>
                      <th align="right" style="padding-bottom:10px;border-bottom:2px solid #111827;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6B7280;">Price</th>
                      <th align="right" style="padding-bottom:10px;border-bottom:2px solid #111827;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6B7280;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemRows}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Totals -->
            <tr>
              <td style="padding:20px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td></td>
                    <td width="240">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:16px;">
                        <tr><td style="padding:16px 16px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">Subtotal</td>
                              <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111827;font-weight:700;text-align:right;">${formatMoney(subtotal, currency)}</td>
                            </tr>
                            <tr>
                              <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">Shipping</td>
                              <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111827;font-weight:700;text-align:right;">${shipping === 0 ? "Free" : formatMoney(shipping, currency)}</td>
                            </tr>
                            ${discountRow}
                            <tr>
                              <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">Estimated Tax</td>
                              <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111827;font-weight:700;text-align:right;">${formatMoney(tax, currency)}</td>
                            </tr>
                            <tr>
                              <td style="padding:10px 0 16px;border-top:1px solid #E5E7EB;padding-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#111827;">Grand Total</td>
                              <td style="padding:10px 0 16px;border-top:1px solid #E5E7EB;padding-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#111827;text-align:right;">${formatMoney(total, currency)}</td>
                            </tr>
                          </table>
                        </td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:32px 32px 8px;" align="center">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:10px;background-color:#111827;">
                      <a href="${orderUrl}" style="display:inline-block;padding:12px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:10px;">View Order Online</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:28px 32px 32px;text-align:center;">
                <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;color:#111827;">Thank you for shopping with Furnitureables.</p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#9CA3AF;">
                  Questions about your order? Email us at
                  <a href="mailto:${supportEmail}" style="color:#111827;text-decoration:underline;">${supportEmail}</a>.
                </p>
                <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#C1C5CC;">
                  This is a computer-generated email and the attached invoice does not require a physical signature.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderInvoiceEmailText(params: InvoiceEmailParams): string {
  const lines = [
    `Thanks for your order, ${params.customerName}!`,
    "",
    `Order #${params.orderNumber} — placed ${formatDate(params.createdAt)}`,
    `Payment: ${params.paymentMethod} (${params.paymentStatus})`,
    `Fulfillment: ${params.fulfillmentStatus}`,
    "",
    "Items:",
    ...params.items.map(
      (item) =>
        `  - ${item.title} x${item.quantity} — ${formatMoney(item.price * item.quantity, params.currency)}`
    ),
    "",
    `Subtotal: ${formatMoney(params.subtotal, params.currency)}`,
    `Shipping: ${params.shipping === 0 ? "Free" : formatMoney(params.shipping, params.currency)}`,
    ...(params.discount > 0
      ? [`Discount${params.couponCode ? ` (${params.couponCode})` : ""}: -${formatMoney(params.discount, params.currency)}`]
      : []),
    `Estimated Tax: ${formatMoney(params.tax, params.currency)}`,
    `Grand Total: ${formatMoney(params.total, params.currency)}`,
    "",
    `View your order online: ${params.orderUrl}`,
    "",
    `Questions? Email us at ${params.supportEmail}`,
    "The full tax invoice is attached to this email as a PDF.",
  ];

  return lines.join("\n");
}
