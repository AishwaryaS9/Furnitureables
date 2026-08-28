import { sendGAEvent } from "@next/third-parties/google";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const isGAEnabled = Boolean(GA_MEASUREMENT_ID);

export function pageview(url: string) {
    if (!isGAEnabled) return;
    sendGAEvent("event", "page_view", {
        page_path: url,
    });
}

export function event(name: string, params: Record<string, unknown> = {}) {
    if (!isGAEnabled) return;
    sendGAEvent("event", name, params);
}
