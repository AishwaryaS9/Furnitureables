"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";

interface AdminUnauthorizedProps {
    email?: string;
}

export default function AdminUnauthorized({ email }: AdminUnauthorizedProps) {
    return (
        <div className="w-full flex flex-col items-center rounded-2xl border border-border/60 bg-card shadow-lg shadow-black/5 px-6 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <TriangleAlert className="h-6 w-6 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1.5">Access denied</h2>
            <p className="text-sm text-muted-foreground mb-6">
                {email ? (
                    <>
                        <span className="font-medium text-foreground">{email}</span>&nbsp;doesn&apos;t have
                        admin access.
                    </>
                ) : (
                    "This account doesn't have admin access."
                )}{" "}
            </p>
            <Link
                href="/"
                className="flex w-full h-10 items-center justify-center text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-2 group"
            >
                Go to Home Page
            </Link>
        </div>
    );
}

