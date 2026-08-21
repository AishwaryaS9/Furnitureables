"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/logo.svg";

const MIN_VISIBLE_MS = 700;
const FADE_MS = 400;

export default function SplashScreen() {
    const [visible, setVisible] = useState(true);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const shown = sessionStorage.getItem("splash-shown");
        if (shown) {
            setVisible(false);
            return;
        }

        const start = Date.now();

        const dismiss = () => {
            const elapsed = Date.now() - start;
            const wait = Math.max(MIN_VISIBLE_MS - elapsed, 0);
            window.setTimeout(() => {
                setFading(true);
                window.setTimeout(() => {
                    setVisible(false);
                    sessionStorage.setItem("splash-shown", "1");
                }, FADE_MS);
            }, wait);
        };

        if (document.readyState === "complete") {
            dismiss();
        } else {
            window.addEventListener("load", dismiss, { once: true });
            return () => window.removeEventListener("load", dismiss);
        }
    }, []);

    if (!visible) return null;

    return (
        <div
            role="status"
            aria-label="Loading Furnitureables"
            className={`fixed inset-0 z-999 flex items-center justify-center bg-background transition-opacity ease-out ${fading ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
        >
            <div className="flex flex-col items-center gap-6">
                <Image
                    src={logo}
                    alt="Furnitureables"
                    priority
                    className="w-40 h-auto sm:w-48 animate-pulse"
                />
                <span className="h-0.5 w-16 overflow-hidden rounded-full bg-border">
                    <span className="block h-full w-1/3 animate-[splash-bar_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
                </span>
            </div>
        </div>
    );
}