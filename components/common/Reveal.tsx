"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Reveal({
    children,
    className,
    ...aria
}: {
    children: ReactNode;
    className?: string;
    role?: string;
    "aria-label"?: string;
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            {...aria}
        >
            {children}
        </motion.div>
    );
}
