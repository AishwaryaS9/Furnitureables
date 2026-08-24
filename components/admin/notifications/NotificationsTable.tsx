"use client";

import { useState } from "react";
import { Bell, BellOff, Check, CheckCheck, PackageCheck, RefreshCw } from "lucide-react";
import { NotificationsTableProps } from "@/types/notification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProductPagination from "../products/ProductPagination";
import { formatNotificationTime } from "@/lib/notifications";

export default function NotificationsTable({
    notifications,
    loading,
    actionId,
    onMarkRead,
    onViewOrder,
    currentPage: controlledPage,
    pageSize = 10,
    totalNotifications,
    onPageChange: controlledPageChange,
}: NotificationsTableProps) {
    const [localPage, setLocalPage] = useState(1);

    const isControlled = controlledPage !== undefined && controlledPageChange !== undefined;
    const activePage = isControlled ? controlledPage : localPage;
    const handlePageChange = isControlled ? controlledPageChange : setLocalPage;

    const totalItems = totalNotifications ?? notifications.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    const displayedNotifications = isControlled
        ? notifications
        : notifications.slice((activePage - 1) * pageSize, activePage * pageSize);

    return (
        <div
            aria-label="Admin Notifications Overview"
            className="w-full rounded-2xl border border-border/80 bg-card/90 shadow-xs backdrop-blur-md overflow-hidden flex flex-col"
        >
            <div
                className="w-full overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                tabIndex={0}
                role="region"
                aria-label="Notifications Data Table Scrollable Area"
            >
                <Table className="w-full text-left">
                    <TableHeader>
                        <TableRow className="border-b border-border/70 bg-muted/50 hover:bg-muted/50">
                            <TableHead scope="col" className="py-3.5 pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[45%] min-w-60">
                                Notification
                            </TableHead>
                            <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[20%] min-w-32">
                                Received
                            </TableHead>
                            <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[15%] min-w-28">
                                Status
                            </TableHead>
                            <TableHead scope="col" className="py-3.5 pr-6 w-[20%] min-w-32 text-right">
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center p-8 text-sm text-muted-foreground" role="status" aria-live="polite">
                                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mb-2" aria-hidden="true" />
                                        <span>Loading notifications...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : displayedNotifications.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={4} className="h-64 p-0 text-center">
                                    <div className="flex flex-col items-center justify-center p-8 text-center" role="status" aria-live="polite">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 border border-border/80 mb-3" aria-hidden="true">
                                            <BellOff className="h-7 w-7 text-muted-foreground/60" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">No notifications found</h3>
                                        <p className="text-xs text-muted-foreground max-w-xs mt-1">
                                            You&apos;ll see new orders and updates here as they come in.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedNotifications.map((notification) => (
                                <TableRow
                                    key={notification.id}
                                    className={`group border-b border-border/40 transition-colors hover:bg-muted/40 ${notification.isRead ? "" : "bg-primary/5"
                                        }`}
                                >
                                    {/* Notification Column */}
                                    <TableCell className="py-4 pl-6 align-top">
                                        <div className="flex gap-3.5">
                                            <span
                                                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                                                aria-hidden="true"
                                            >
                                                <PackageCheck className="h-4 w-4" />
                                            </span>
                                            <div className="flex flex-col min-w-0 gap-0.5 max-w-md">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate text-sm font-semibold text-foreground">
                                                        {notification.title}
                                                    </span>
                                                    {!notification.isRead && (
                                                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                {notification.orderId && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onViewOrder(notification.orderId!)}
                                                        className="mt-1 inline-flex w-fit items-center text-[11px] font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm cursor-pointer"
                                                    >
                                                        View order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Received Column */}
                                    <TableCell className="py-4 align-top whitespace-nowrap">
                                        <time
                                            dateTime={notification.createdAt}
                                            className="text-xs font-medium text-muted-foreground"
                                        >
                                            {formatNotificationTime(notification.createdAt)}
                                        </time>
                                    </TableCell>

                                    {/* Status Column */}
                                    <TableCell className="py-4 align-top whitespace-nowrap">
                                        <Badge
                                            variant="outline"
                                            className={
                                                notification.isRead
                                                    ? "rounded-full border-border/60 bg-muted/50 text-muted-foreground text-xs font-medium"
                                                    : "rounded-full border-primary/20 bg-primary/10 text-primary text-xs font-medium"
                                            }
                                        >
                                            {notification.isRead ? (
                                                <>
                                                    <CheckCheck className="mr-1 h-3 w-3" aria-hidden="true" /> Read
                                                </>
                                            ) : (
                                                <>
                                                    <Bell className="mr-1 h-3 w-3" aria-hidden="true" /> Unread
                                                </>
                                            )}
                                        </Badge>
                                    </TableCell>

                                    {/* Actions Column */}
                                    <TableCell className="py-4 pr-6 text-right align-top">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 rounded-lg px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
                                            onClick={() => onMarkRead(notification.id)}
                                            disabled={notification.isRead || actionId === notification.id}
                                            aria-label={
                                                notification.isRead
                                                    ? `${notification.title} already read`
                                                    : `Mark "${notification.title}" as read`
                                            }
                                        >
                                            {actionId === notification.id ? (
                                                <RefreshCw
                                                    className="mr-1.5 h-3.5 w-3.5 animate-spin"
                                                    aria-hidden="true"
                                                />
                                            ) : notification.isRead ? (
                                                <CheckCheck
                                                    className="mr-1.5 h-3.5 w-3.5"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <Check
                                                    className="mr-1.5 h-3.5 w-3.5"
                                                    aria-hidden="true"
                                                />
                                            )}

                                            {notification.isRead ? "Read" : "Mark as read"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Footer */}
            {!loading && totalItems > 0 && (
                <div className="border-t border-border/70 px-4 py-2 bg-muted/20">
                    <ProductPagination
                        currentPage={activePage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        itemLabel="notifications"
                    />
                </div>
            )}
        </div>
    );
}
