"use client";

import { useState } from "react";
import clsx from "clsx";
import { Bell, Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AdminSidebar from "./AdminSidebar";

export default function AdminNavbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-30 h-18 bg-card backdrop-blur-xl border-b border-border/60 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all shadow-xs"
                role="banner">
                {/* Left side */}
                <div className="flex items-center gap-3.5">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileOpen(true)}
                        aria-label="Open navigation menu"
                        className="lg:hidden h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    >
                        <Menu className="h-5 w-5" aria-hidden="true" />
                    </Button>

                    <div className="flex flex-col">
                        <h1 className="text-base sm:text-lg font-semibold font-serif text-foreground tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="hidden sm:block text-xs text-muted-foreground font-medium">
                            Manage your store performance, orders, and products
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="View notifications (3 unread)"
                        className="relative h-10 w-10 p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all duration-200"
                    >
                        <Bell className="h-5 w-5" aria-hidden="true" />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-destructive ring-4 ring-card animate-pulse" />
                    </Button>

                    <Separator orientation="vertical" className="h-6 bg-border/60 hidden sm:block" />

                    <div className="flex items-center pl-0.5">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox:
                                        "h-9 w-9 ring-1 ring-border/80 hover:ring-ring transition-all rounded-full shadow-xs",
                                },
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay Drawer */}
            <div
                className={clsx(
                    "fixed inset-0 z-50 lg:hidden flex transition-opacity duration-300",
                    isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
                <div
                    className={clsx(
                        "relative max-w-xs z-10 transition-transform duration-300 ease-out shadow-2xl bg-background h-full",
                        isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <AdminSidebar onCloseMobile={() => setIsMobileOpen(false)} />
                </div>
            </div>
        </>
    );
}