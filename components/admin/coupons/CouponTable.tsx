"use client";

import { Sparkles, UserRound, Pencil, MoreHorizontal, Copy, TicketPercent, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Coupon } from "@/types/coupon";

interface Props {
    coupons: Coupon[];
    loading: boolean;
    onEdit: (coupon: Coupon) => void;
    onDeleteRequest: (coupon: Coupon) => void;
}

function money(value?: number | null) {
    return value == null ? "—" : `₹${value.toLocaleString("en-IN")}`;
}

function status(coupon: Coupon) {
    if (!coupon.isActive) {
        return { label: "Inactive", className: "bg-muted text-muted-foreground" };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return { label: "Expired", className: "bg-destructive/10 text-destructive" };
    }

    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
        return { label: "Exhausted", className: "bg-destructive/10 text-destructive" };
    }

    return { label: "Active", className: "bg-primary/10 text-primary" };
}

export default function CouponTable({ coupons, loading, onEdit, onDeleteRequest }: Props) {
    const handleCopyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("Copied to clipboard", {
                description: `Coupon code ${code} copied successfully.`,
            });
        } catch {
            toast.error("Failed to copy", {
                description: "Please check your browser permissions.",
            });
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <section
            aria-label="Coupons Overview"
            className="rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-md overflow-hidden"
        >
            <div
                className="overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                tabIndex={0}
                role="region"
                aria-label="Coupons Data Table Scrollable Area"
            >
                <Table aria-label="Coupons Table" className="w-full min-w-225 text-left">
                    <TableHeader>
                        <TableRow className="border-b border-border/70 bg-muted/50 hover:bg-muted/50">
                            <TableHead scope="col" className="py-3.5 pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coupon</TableHead>
                            <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Offer</TableHead>
                            <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Eligibility</TableHead>
                            <TableHead scope="col" className="py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usage</TableHead>
                            <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Expires</TableHead>
                            <TableHead scope="col" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                            <TableHead scope="col" className="py-3.5 pr-6 w-12 text-right sr-only">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {coupons.map((coupon) => {
                            const st = status(coupon);
                            const expiresIso = coupon.expiresAt ? new Date(coupon.expiresAt).toISOString() : undefined;

                            return (
                                <TableRow
                                    key={coupon.id}
                                    className="group border-b border-border/40 transition-colors hover:bg-muted/40"
                                >
                                    {/* Coupon */}
                                    <TableCell className="py-4 pl-6">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Sparkles className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-mono text-xs font-bold tracking-wide text-foreground truncate max-w-40 sm:max-w-56">
                                                    {coupon.code}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate max-w-40 sm:max-w-56">
                                                    {coupon.campaignName || coupon.description || "General offer"}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Offer */}
                                    <TableCell className="py-4 text-xs font-medium text-foreground whitespace-nowrap">
                                        <div className="font-semibold text-sm">
                                            {coupon.discountType === "PERCENTAGE"
                                                ? `${coupon.discountValue}% off`
                                                : `${money(coupon.discountValue)} off`}
                                        </div>
                                        {coupon.minimumOrder != null && (
                                            <div className="text-[11px] font-normal text-muted-foreground">
                                                Min. {money(coupon.minimumOrder)}
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Eligibility */}
                                    <TableCell className="py-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                        {coupon.newUserOnly ? (
                                            <Badge variant="secondary" className="rounded-full gap-1">
                                                <UserRound className="h-3 w-3" />
                                                New users
                                            </Badge>
                                        ) : (
                                            <span>All customers</span>
                                        )}
                                    </TableCell>

                                    {/* Usage */}
                                    <TableCell className="py-4 text-center">
                                        <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums whitespace-nowrap">
                                            {coupon.usedCount}
                                            {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : " / ∞"}
                                        </span>
                                    </TableCell>

                                    {/* Expires */}
                                    <TableCell className="py-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                        {coupon.expiresAt ? (
                                            <time dateTime={expiresIso}>
                                                {new Date(coupon.expiresAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </time>
                                        ) : (
                                            <span>No expiry</span>
                                        )}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell className="py-4">
                                        <Badge variant="secondary" className={`rounded-full ${st.className}`}>
                                            {st.label}
                                        </Badge>
                                        {coupon.isPromotional && (
                                            <p className="mt-1 text-[10px] font-medium text-primary">
                                                Navbar promotion
                                            </p>
                                        )}
                                    </TableCell>

                                    {/* Actions Menu */}
                                    <TableCell className="py-4 pr-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                                                aria-label={`Open actions menu for ${coupon.code}`}
                                            >
                                                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 shadow-md rounded-xl p-1 z-50">
                                                <DropdownMenuGroup>
                                                    <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => onEdit(coupon)}
                                                        className="cursor-pointer gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                                        <span>Edit Coupon</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleCopyCode(coupon.code)}
                                                        className="cursor-pointer gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                                        <span>Copy Coupon Code</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onDeleteRequest(coupon)}
                                                        aria-label={`Delete coupon ${coupon.code}`}
                                                        className="cursor-pointer gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors text-destructive focus:bg-destructive/80 focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                                        <span>Delete Coupon</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {/* Empty State */}
                        {coupons.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center p-8 text-center" role="status" aria-live="polite" aria-atomic="true">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 border border-border/80 mb-3" aria-hidden="true">
                                            <TicketPercent className="h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">No coupons yet</h3>
                                        <p className="text-xs text-muted-foreground max-w-xs mt-1">
                                            Create your first promotion from the button above.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}