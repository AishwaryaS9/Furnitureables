
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphql/client";
import { ADMIN_COUPONS } from "@/lib/graphql/queries";
import { ADMIN_DELETE_COUPON } from "@/lib/graphql/mutations";
import { Coupon } from "@/types/coupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import CouponTable from "@/components/admin/coupons/CouponTable";
import CouponModal from "@/components/admin/coupons/CouponModal";
import CouponStats from "@/components/admin/coupons/CouponStats";
import DeleteCouponDialog from "@/components/admin/coupons/DeleteCouponDialog";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Coupon | null>(null);
    const [deleting, setDeleting] = useState<Coupon | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadCoupons = useCallback(async () => {
        setLoading(true);
        try {
            const data = await graphqlClient.request<{ adminCoupons: Coupon[] }>(ADMIN_COUPONS);
            setCoupons(data.adminCoupons);
        } catch (error: any) {
            toast.error(error?.response?.errors?.[0]?.message ?? error?.message ?? "Unable to load coupons.");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadCoupons(); }, [loadCoupons]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return coupons.filter((coupon) => !q || [coupon.code, coupon.campaignName, coupon.description, coupon.promotionText].filter(Boolean).join(" ").toLowerCase().includes(q));
    }, [coupons, search]);

    const active = coupons.filter((c) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date()) && (c.usageLimit == null || c.usedCount < c.usageLimit)).length;
    const promotional = coupons.filter((c) => c.isActive && c.isPromotional).length;
    const newUser = coupons.filter((c) => c.newUserOnly).length;

    function openCreate() { setEditing(null); setModalOpen(true); }
    function openEdit(coupon: Coupon) { setEditing(coupon); setModalOpen(true); }

    async function confirmDeleteCoupon() {
        if (!deleting) return;
        const id = deleting.id;
        setIsDeleting(true);
        try {
            await graphqlClient.request(ADMIN_DELETE_COUPON, { id });
            setCoupons((current) => current.filter((coupon) => coupon.id !== id));
            toast.success("Coupon deleted successfully.");
            setDeleting(null);
        } catch (error: any) {
            toast.error(error?.response?.errors?.[0]?.message ?? error?.message ?? "Unable to delete coupon.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <main className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                        Coupons
                    </h1>
                    <p className="mt-2 max-w-2xl text-xs sm:text-sm font-light leading-relaxed text-muted-foreground">
                        Create and manage customer offers, seasonal sales, and new-user discounts from one place.
                    </p>
                </div>

                <div className="flex gap-2" role="group" aria-label="Coupon actions">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={loadCoupons}
                        disabled={loading}
                        aria-label={loading ? "Refreshing coupons" : "Refresh coupons"}
                        className="h-11 rounded-xl"
                    >
                        <RefreshCw
                            aria-hidden="true"
                            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                    <Button
                        type="button"
                        onClick={openCreate}
                        aria-haspopup="dialog"
                        className="h-11 rounded-xl px-5 shadow-sm shadow-primary/20"
                    >
                        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                        Add Coupon
                    </Button>
                </div>
            </header>

            <section aria-labelledby="coupon-summary-heading" className="space-y-4">
                <h2 id="coupon-summary-heading" className="sr-only">
                    Coupon summary metrics
                </h2>
                <CouponStats
                    total={coupons.length}
                    active={active}
                    promotional={promotional}
                    newUserOnly={newUser}
                />
            </section>

            <section aria-labelledby="coupon-list-heading" className="space-y-4">
                <h2 id="coupon-list-heading" className="sr-only">
                    All coupons
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Label htmlFor="coupon-search" className="sr-only">
                            Search coupons by code, campaign, or description
                        </Label>
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            id="coupon-search"
                            type="search"
                            role="searchbox"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search code, campaign, or description..."
                            className="h-11 rounded-2xl bg-card/60 pl-10"
                        />
                    </div>

                    <Badge
                        variant="secondary"
                        role="status"
                        aria-live="polite"
                        className="w-fit rounded-full px-3 py-1"
                    >
                        {filtered.length} {filtered.length === 1 ? "coupon" : "coupons"}
                    </Badge>
                </div>

                <CouponTable
                    coupons={filtered}
                    loading={loading}
                    onEdit={openEdit}
                    onDeleteRequest={setDeleting}
                />
            </section>

            <CouponModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                coupon={editing}
                onSaved={loadCoupons}
            />

            <DeleteCouponDialog
                open={!!deleting}
                onOpenChange={(open) => { if (!open) setDeleting(null); }}
                coupon={deleting}
                onConfirm={confirmDeleteCoupon}
                isLoading={isDeleting}
            />
        </main>
    );
}