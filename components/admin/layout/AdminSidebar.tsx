"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { X, LogOut } from "lucide-react";
import { menuItems } from "@/lib/data";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

export default function AdminSidebar({ onCloseMobile, className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx("w-72 h-full flex flex-col justify-between text-sidebar-foreground", className)}
      aria-label="Sidebar Navigation"
    >
      <div className="flex flex-col h-full bg-card/60 backdrop-blur-xl border-r border-border/60 shadow-xs overflow-hidden">
        {/* Brand Header */}
        <div className="h-18 flex items-center justify-between px-6 border-b border-border/40">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-serif font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            aria-label="Furnitureables Homepage"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-sans font-bold shadow-sm shadow-primary/20">
              F
            </span>
            <span className="text-foreground">
              Furniture<span className="font-sans text-muted-foreground font-normal">ables</span>
            </span>
          </Link>

          {onCloseMobile && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="lg:hidden h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1" aria-label="Main Navigation">
          <p className="px-3 pb-2 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">
            Overview
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-xs shadow-primary/5"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span
                  className={clsx(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
                      : "bg-muted/50 group-hover:bg-background text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-border/40" />

        {/* Footer */}
        <div className="p-4 bg-muted/20">
          <div className="flex items-center gap-3 rounded-2xl p-2 bg-card/80 border border-border/50 shadow-xs hover:bg-accent/50 transition-all duration-200">
            <Avatar className="h-9 w-9 shrink-0 rounded-xl">
              <AvatarFallback className="rounded-xl bg-primary/15 text-primary text-sm font-semibold shadow-inner">
                A
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">Admin User</p>
              <p className="truncate text-xs text-muted-foreground">admin@furnitureables.com</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-background shadow-xs transition-colors"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}