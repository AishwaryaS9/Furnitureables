"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollToTopWatcher() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        const mainContent = document.getElementById("main-content");
        if (mainContent) {
            mainContent.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
    }, [pathname, searchParams]);

    return null;
}

export default function ScrollToTop() {
    return (
        <Suspense fallback={null}>
            <ScrollToTopWatcher />
        </Suspense>
    );
}
