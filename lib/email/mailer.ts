import nodemailer, { type Transporter } from "nodemailer";

export interface SendEmailAttachment {
    filename: string;
    content: Buffer;
    contentType?: string;
    cid?: string;
}

export interface SendEmailInput {
    to: string;
    subject: string;
    html: string;
    text?: string;
    attachments?: SendEmailAttachment[];
}

let cachedTransporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
    if (cachedTransporter !== undefined) {
        return cachedTransporter;
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;

    if (!host || !port || !user || !password) {
        console.warn(
            "[mailer] SMTP is not fully configured (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD). Emails will be skipped."
        );
        cachedTransporter = null;
        return cachedTransporter;
    }

    cachedTransporter = nodemailer.createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE
            ? process.env.SMTP_SECURE === "true"
            : port === 465,
        auth: { user, pass: password },
    });

    return cachedTransporter;
}

export function getFromAddress() {
    const email = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "no-reply@furnitureables.vercel.app";
    const name = process.env.SMTP_FROM_NAME || "Furnitureables";
    return `"${name}" <${email}>`;
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
    const transporter = getTransporter();

    if (!transporter) {
        return false;
    }

    try {
        await transporter.sendMail({
            from: getFromAddress(),
            to: input.to,
            subject: input.subject,
            html: input.html,
            text: input.text,
            attachments: input.attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
                cid: attachment.cid,
            })),
        });

        return true;
    } catch (error) {
        console.error("[mailer] Failed to send email:", error);
        return false;
    }
}



