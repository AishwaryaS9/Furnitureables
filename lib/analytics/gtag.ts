export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const isGAEnabled = Boolean(GA_MEASUREMENT_ID);

type GtagArgs = unknown[];

declare global {
    interface Window {
        dataLayer?: GtagArgs[];
    }
}

// gtag.js expects the `arguments` object (not an array) to be pushed.
function gtag(..._args: GtagArgs) {
    // eslint-disable-next-line prefer-rest-params
    (window.dataLayer = window.dataLayer || []).push(arguments as unknown as GtagArgs);
}

// gtag.js itself is loaded lazily (see components/analytics/GoogleAnalytics).
// The `js` / `config` commands are queued here first so that events fired
// before the script arrives are replayed in the right order.
let initialised = false;
function ensureInit() {
    if (initialised || !GA_MEASUREMENT_ID) return;
    initialised = true;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function pageview(url: string) {
    if (!isGAEnabled || typeof window === "undefined") return;
    ensureInit();
    gtag("event", "page_view", {
        page_path: url,
    });
}

export function event(name: string, params: Record<string, unknown> = {}) {
    if (!isGAEnabled || typeof window === "undefined") return;
    ensureInit();
    gtag("event", name, params);
}
