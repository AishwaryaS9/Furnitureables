import Script from "next/script";

/**
 * Loads gtag.js with `lazyOnload`: it is fetched after the page has finished
 * loading and the browser is idle, so it never competes with the content that
 * determines LCP / TBT. Events fired earlier are queued in `dataLayer` and
 * flushed once gtag.js arrives (see lib/analytics/gtag.ts).
 */
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
    return (
        <Script
            id="ga-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
        />
    );
}
