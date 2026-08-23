"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Loader2, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAdminNotifications, useAdminUnreadNotificationCount, useMarkAllNotificationsRead, useMarkNotificationRead } from "@/hooks/useAdminNotifications";
import { useAdminNotificationsStream } from "@/hooks/useAdminNotificationsStream";
import { AdminNotification } from "@/types/notification";

const MAX_BADGE_COUNT = 5;

function formatRelativeTime(iso: string) {
    try {
        return formatDistanceToNow(new Date(iso), { addSuffix: true });
    } catch {
        return "";
    }
}

function NotificationRow({ notification, onRead, isMarking }: {
    notification: AdminNotification;
    onRead: (id: string) => void;
    isMarking: boolean;
}) {
    const content = (
        <div
            className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted/70 ${notification.isRead ? "" : "bg-primary/5"
                }`}
        >
            <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                aria-hidden="true"
            >
                <PackageCheck className="h-4 w-4" />
            </span>

            <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">
                        {notification.title}
                    </span>
                    {!notification.isRead && (
                        <span
                            className="h-2 w-2 shrink-0 rounded-full bg-primary"
                            aria-hidden="true"
                        />
                    )}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {notification.message}
                </span>
                <time
                    dateTime={notification.createdAt}
                    className="mt-1 block text-[11px] font-medium text-muted-foreground/80"
                >
                    {formatRelativeTime(notification.createdAt)}
                </time>
            </span>
        </div>
    );

    return (
        <li>
            {notification.orderId ? (
                <Link
                    href={`/admin/orders?orderId=${notification.orderId}`}
                    onClick={() => {
                        if (!notification.isRead) onRead(notification.id);
                    }}
                    aria-label={`${notification.title}. ${notification.message}. ${notification.isRead ? "Read" : "Unread"
                        }. View order.`}
                    className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {content}
                </Link>
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        if (!notification.isRead) onRead(notification.id);
                    }}
                    disabled={isMarking || notification.isRead}
                    aria-label={`${notification.title}. ${notification.message}. ${notification.isRead ? "Read" : "Mark as read"
                        }.`}
                    className="block w-full cursor-pointer rounded-xl text-left disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {content}
                </button>
            )}
        </li>
    );
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false);

    useAdminNotificationsStream();

    const { data: unreadCount = 0 } = useAdminUnreadNotificationCount();
    const { data: notifications = [], isLoading } = useAdminNotifications(20);
    const markOneRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const hasUnread = unreadCount > 0;
    const badgeLabel = unreadCount > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(unreadCount);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                aria-label={
                    hasUnread
                        ? `View notifications (${unreadCount} unread)`
                        : "View notifications"
                }
                className="relative h-10 w-10 p-2.5 inline-flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all duration-200 cursor-pointer"
            >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {hasUnread && (
                    <span
                        role="status"
                        aria-live="polite"
                        className="absolute top-1.5 right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-none text-background ring-1 ring-card"
                    >
                        {badgeLabel}
                    </span>
                )}
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={10}
                aria-label="Notifications"
                className="w-80 sm:w-96 p-0 overflow-hidden rounded-2xl"
            >
                <PopoverHeader className="flex flex-row items-center justify-between gap-2 px-4 pt-3.5 pb-2.5">
                    <PopoverTitle className="text-sm font-semibold text-foreground">
                        Notifications
                    </PopoverTitle>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => markAllRead.mutate()}
                        disabled={!hasUnread || markAllRead.isPending}
                        aria-label="Mark all notifications as read"
                        className="h-7 gap-1.5 rounded-lg px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40"
                    >
                        {markAllRead.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                        ) : (
                            <CheckCheck className="h-3 w-3" aria-hidden="true" />
                        )}
                        Mark all read
                    </Button>
                </PopoverHeader>

                <Separator className="bg-border/60" />

                {isLoading ? (
                    <div className="space-y-2 p-4" aria-hidden="true">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div
                        role="status"
                        className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center"
                    >
                        <Bell className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
                        <p className="text-sm font-medium text-foreground">No notifications yet</p>
                        <p className="text-xs text-muted-foreground">
                            You&apos;ll see new orders here as customers place them.
                        </p>
                    </div>
                ) : (
                    <ul
                        role="list"
                        aria-label="Recent notifications"
                        className="max-h-96 space-y-0.5 overflow-y-auto p-1.5"
                    >
                        {notifications.map((notification) => (
                            <NotificationRow
                                key={notification.id}
                                notification={notification}
                                onRead={(id) => markOneRead.mutate(id)}
                                isMarking={markOneRead.isPending}
                            />
                        ))}
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    );
}
