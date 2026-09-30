"use client";

import dynamic from "next/dynamic";

const SalesChart = dynamic(() => import("./SalesChart"), {
    ssr: false,
    loading: () => (
        <div
            role="status"
            aria-label="Loading sales chart"
            className="h-80 w-full animate-pulse rounded-2xl border border-border/50 bg-muted/40"
        />
    ),
});

export default SalesChart;
