import { NextRequest } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { subscribeToAdminNotifications, type AdminNotificationEvent } from "@/lib/notifications/events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HEARTBEAT_INTERVAL_MS = 25_000;

export async function GET(request: NextRequest) {
    const admin = await getAdminUser();

    if (!admin) {
        return new Response("Forbidden", { status: 403 });
    }

    const encoder = new TextEncoder();
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let unsubscribe: (() => void) | undefined;

    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            const send = (event: AdminNotificationEvent) => {
                controller.enqueue(
                    encoder.encode(`event: notification\ndata: ${JSON.stringify(event)}\n\n`)
                );
            };

            controller.enqueue(encoder.encode(": connected\n\n"));

            unsubscribe = subscribeToAdminNotifications(send);

            heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(": heartbeat\n\n"));
                } catch {
                    // Controller already closed; cleanup happens in `cancel`.
                }
            }, HEARTBEAT_INTERVAL_MS);
        },
        cancel() {
            if (heartbeat) clearInterval(heartbeat);
            if (unsubscribe) unsubscribe();
        },
    });

    request.signal.addEventListener("abort", () => {
        if (heartbeat) clearInterval(heartbeat);
        if (unsubscribe) unsubscribe();
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}
