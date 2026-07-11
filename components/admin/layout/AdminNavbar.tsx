"use client";

import { Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function AdminNavbar() {
    return (
        <header className="h-16 bg-white border-b border-zinc-200 px-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
                Admin Panel
            </h2>

            <div className="flex items-center gap-5">
                <Bell
                    size={20}
                    className="text-zinc-500 cursor-pointer"
                />

                <UserButton
                // afterSignOutUrl="/" 
                />
            </div>
        </header>
    );
}