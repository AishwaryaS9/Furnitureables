"use client";

import * as React from "react";
import { UsersRound, Eye, Mail, MoreHorizontal, Copy } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { AdminCustomer } from "@/types/customer";
import { formatCurrency, formatOrderDate } from "@/lib/order";
import CustomerDetailsModal from "./CustomerDetailsModal";

interface Props {
    customers: AdminCustomer[];
}

export default function CustomerTable({ customers }: Props) {
    const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleViewDetails = (customerId: string) => {
        setSelectedCustomerId(customerId);
        setIsDialogOpen(true);
    };

    const handleCopyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email);
            toast.success("Copied to clipboard", {
                description: `Email ${email} copied successfully.`,
            });
        } catch {
            toast.error("Failed to copy", {
                description: "Please check your browser permissions.",
            });
        }
    };

    return (
        <>
            <section
                aria-label="Customers Overview"
                className="rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-md overflow-hidden"
            >
                <div
                    className="overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    tabIndex={0}
                    role="region"
                    aria-label="Customers Data Table Scrollable Area"
                >
                    <Table aria-label="Customers Table" className="w-full min-w-200 text-left">
                        <TableHeader>
                            <TableRow className="border-b border-border/70 bg-muted/50 hover:bg-muted/50">
                                <TableHead scope="col" className="py-3.5 pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer ID</TableHead>
                                <TableHead scope="col" className="py-3.5 pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer Name</TableHead>
                                <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Joined</TableHead>
                                <TableHead scope="col" className="py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orders</TableHead>
                                <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Last Order</TableHead>
                                <TableHead scope="col" className="py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Spent</TableHead>
                                <TableHead scope="col" className="py-3.5 pr-6 w-12 text-right sr-only">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {customers.map((customer) => {
                                const joined = formatOrderDate(customer.joinedAt);
                                const joinedIso = new Date(customer.joinedAt).toISOString();
                                const lastOrder = customer.lastOrderAt
                                    ? formatOrderDate(customer.lastOrderAt)
                                    : "—";

                                return (
                                    <TableRow
                                        key={customer.id}
                                        className="group border-b border-border/40 transition-colors hover:bg-muted/40"
                                    >
                                        {/* Customer ID */}
                                        <TableCell className="py-4 pl-6">
                                            <span className="font-medium text-sm text-foreground truncate max-w-40 sm:max-w-56">
                                                {customer.id}
                                            </span>
                                        </TableCell>
                                        {/* Customer */}
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="min-w-0">
                                                    <div className="font-medium text-sm text-foreground truncate max-w-40 sm:max-w-56">
                                                        {customer.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground truncate max-w-40 sm:max-w-56">
                                                        {customer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Joined */}
                                        <TableCell className="py-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                            <time dateTime={joinedIso}>{joined}</time>
                                        </TableCell>

                                        {/* Orders */}
                                        <TableCell className="py-4 text-center">
                                            <span
                                                className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums whitespace-nowrap"
                                                aria-label={`${customer.totalOrders} ${customer.totalOrders === 1 ? "order" : "orders"} placed`}
                                            >
                                                {customer.totalOrders} {customer.totalOrders === 1 ? "order" : "orders"}
                                            </span>
                                        </TableCell>

                                        {/* Last Order */}
                                        <TableCell className="py-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                            {customer.lastOrderAt ? (
                                                <time dateTime={new Date(customer.lastOrderAt).toISOString()}>{lastOrder}</time>
                                            ) : (
                                                <span>{lastOrder}</span>
                                            )}
                                        </TableCell>

                                        {/* Total Spent */}
                                        <TableCell className="py-4 text-right font-semibold text-foreground text-sm tabular-nums whitespace-nowrap">
                                            <span aria-label={`Total spent: ${formatCurrency(customer.totalSpent, customer.currency)}`}>
                                                {formatCurrency(customer.totalSpent, customer.currency)}
                                            </span>
                                        </TableCell>

                                        {/* Actions Menu */}
                                        <TableCell className="py-4 pr-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                                                    aria-label={`Open actions menu for ${customer.name}`}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 shadow-md rounded-xl p-1 z-50">
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => handleViewDetails(customer.id)}
                                                            className="cursor-pointer gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors focus:bg-accent focus:text-accent-foreground"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                                            <span>View Customer Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleCopyEmail(customer.email)}
                                                            className="cursor-pointer gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors focus:bg-accent focus:text-accent-foreground"
                                                        >
                                                            <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                                            <span>Copy Email Address</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                window.location.href = `mailto:${customer.email}`;
                                                            }}
                                                            className="cursor-pointer gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors focus:bg-accent focus:text-accent-foreground"
                                                        >
                                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                                            <span>Email Customer</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            {/* Empty State */}
                            {customers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center p-8 text-center" role="status" aria-live="polite" aria-atomic="true">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 border border-border/80 mb-3" aria-hidden="true">
                                                <UsersRound className="h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-foreground">No customers found</h3>
                                            <p className="text-xs text-muted-foreground max-w-xs mt-1">
                                                Try adjusting your search query, or check back later.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </section>

            {/* Customer Details Modal */}
            <CustomerDetailsModal
                customerId={selectedCustomerId}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </>
    );
}
