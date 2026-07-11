import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    const headerPayload = await headers();

    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response("Missing Svix headers", {
            status: 400,
        });
    }

    const payload = await req.text();

    const wh = new Webhook(WEBHOOK_SECRET);

    let event: any;

    try {
        event = wh.verify(payload, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        });
    } catch (err) {
        console.error("Webhook verification failed:", err);

        return new Response("Invalid signature", {
            status: 400,
        });
    }

    const { type, data } = event;
    // console.log("event info", JSON.stringify(event))

    switch (type) {
        case "user.created":
            await prisma.user.create({
                data: {
                    clerkId: data.id,
                    email: data.email_addresses[0]?.email_address ?? "",
                    firstName: data.first_name,
                    lastName: data.last_name,
                },
            });
            break;

        case "user.updated":
            await prisma.user.update({
                where: {
                    clerkId: data.id,
                },
                data: {
                    email: data.email_addresses[0]?.email_address ?? "",
                    firstName: data.first_name,
                    lastName: data.last_name,
                },
            });
            break;

        case "user.deleted":
            if (data.id) {
                await prisma.user.delete({
                    where: {
                        clerkId: data.id,
                    },
                });
            }
            break;
    }

    // console.log('response user==>', JSON.stringify(Response))

    return Response.json({
        success: true,
    });
}