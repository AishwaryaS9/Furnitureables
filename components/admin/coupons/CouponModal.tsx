"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { toast } from "sonner";
import { Tag, Percent, IndianRupee, Ticket, Users, CalendarClock, Megaphone, Loader2 } from "lucide-react";
import { graphqlClient } from "@/lib/graphql/client";
import { ADMIN_CREATE_COUPON, ADMIN_UPDATE_COUPON } from "@/lib/graphql/mutations";
import { Coupon } from "@/types/coupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    coupon?: Coupon | null;
    onSaved: () => void;
}

type FormState = {
    code: string;
    description: string;
    campaignName: string;
    promotionText: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: string;
    minimumOrder: string;
    maximumDiscount: string;
    usageLimit: string;
    expiresAt: string;
    isActive: boolean;
    isPromotional: boolean;
    priority: string;
    newUserOnly: boolean;
};

type FormErrors = Partial<Record<"code" | "discountValue", string>>;

const emptyForm: FormState = {
    code: "",
    description: "",
    campaignName: "",
    promotionText: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumOrder: "",
    maximumDiscount: "",
    usageLimit: "",
    expiresAt: "",
    isActive: true,
    isPromotional: false,
    priority: "0",
    newUserOnly: false,
};

const PROMOTION_TEXT_LIMIT = 60;

function toDateInput(value?: string | null) {
    if (!value) return "";

    return new Date(value).toISOString().slice(0, 10);
}

export default function CouponModal({
    open,
    onOpenChange,
    coupon,
    onSaved,
}: Props) {
    const [form, setForm] = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [saving, setSaving] = useState(false);

    const uid = useId();
    const ids = {
        title: `${uid}-title`,
        desc: `${uid}-desc`,
        code: `${uid}-code`,
        codeHint: `${uid}-code-hint`,
        campaignName: `${uid}-campaign-name`,
        description: `${uid}-description`,
        discountType: `${uid}-discount-type`,
        discountValue: `${uid}-discount-value`,
        discountValueHint: `${uid}-discount-value-hint`,
        minimumOrder: `${uid}-minimum-order`,
        minimumOrderHint: `${uid}-minimum-order-hint`,
        maximumDiscount: `${uid}-maximum-discount`,
        maximumDiscountHint: `${uid}-maximum-discount-hint`,
        usageLimit: `${uid}-usage-limit`,
        usageLimitHint: `${uid}-usage-limit-hint`,
        expiresAt: `${uid}-expires-at`,
        newUserOnly: `${uid}-new-user-only`,
        newUserOnlyHint: `${uid}-new-user-only-hint`,
        isActive: `${uid}-is-active`,
        isActiveHint: `${uid}-is-active-hint`,
        isPromotional: `${uid}-is-promotional`,
        isPromotionalHint: `${uid}-is-promotional-hint`,
        promotionText: `${uid}-promotion-text`,
        promotionTextHint: `${uid}-promotion-text-hint`,
        priority: `${uid}-priority`,
        status: `${uid}-status`,
    };

    useEffect(() => {
        if (!open) return;

        setErrors({});
        setForm(
            coupon
                ? {
                    code: coupon.code,
                    description: coupon.description ?? "",
                    campaignName: coupon.campaignName ?? "",
                    promotionText: coupon.promotionText ?? "",
                    discountType: coupon.discountType,
                    discountValue: String(coupon.discountValue),
                    minimumOrder:
                        coupon.minimumOrder == null
                            ? ""
                            : String(coupon.minimumOrder),
                    maximumDiscount:
                        coupon.maximumDiscount == null
                            ? ""
                            : String(coupon.maximumDiscount),
                    usageLimit:
                        coupon.usageLimit == null
                            ? ""
                            : String(coupon.usageLimit),
                    expiresAt: toDateInput(coupon.expiresAt),
                    isActive: coupon.isActive,
                    isPromotional: coupon.isPromotional,
                    priority: String(coupon.priority),
                    newUserOnly: coupon.newUserOnly,
                }
                : emptyForm
        );
    }, [open, coupon]);

    const set = (key: keyof FormState, value: any) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const offerSummary = useMemo(() => {
        const value = Number(form.discountValue);
        if (!Number.isFinite(value) || value <= 0) return null;

        const amount =
            form.discountType === "PERCENTAGE" ? `${value}% off` : `₹${value} off`;

        const min = form.minimumOrder
            ? ` orders over ₹${form.minimumOrder}`
            : " all orders";

        const cap =
            form.discountType === "PERCENTAGE" && form.maximumDiscount
                ? `, capped at ₹${form.maximumDiscount}`
                : "";

        return `${amount}${min}${cap}`;
    }, [form.discountType, form.discountValue, form.minimumOrder, form.maximumDiscount]);

    async function submit(e: React.FormEvent) {
        e.preventDefault();

        const discountValue = Number(form.discountValue);
        const nextErrors: FormErrors = {};

        if (!form.code.trim()) {
            nextErrors.code = "Coupon code is required.";
        }

        if (!Number.isFinite(discountValue) || discountValue <= 0) {
            nextErrors.discountValue = "Enter a valid discount value.";
        } else if (form.discountType === "PERCENTAGE" && discountValue > 100) {
            nextErrors.discountValue = "Percentage discount cannot exceed 100%.";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            // Surface the first error to assistive tech and move focus there.
            const firstKey = Object.keys(nextErrors)[0] as keyof FormErrors;
            toast.error(nextErrors[firstKey]!);
            document
                .getElementById(firstKey === "code" ? ids.code : ids.discountValue)
                ?.focus();
            return;
        }

        setSaving(true);

        try {
            const input = {
                code: form.code.trim().toUpperCase(),
                description: form.description.trim() || null,
                campaignName: form.campaignName.trim() || null,
                promotionText: form.promotionText.trim() || null,
                discountType: form.discountType,
                discountValue,
                minimumOrder: form.minimumOrder
                    ? Number(form.minimumOrder)
                    : null,
                maximumDiscount: form.maximumDiscount
                    ? Number(form.maximumDiscount)
                    : null,
                usageLimit: form.usageLimit
                    ? Number(form.usageLimit)
                    : null,
                expiresAt: form.expiresAt
                    ? new Date(
                        `${form.expiresAt}T23:59:59`
                    ).toISOString()
                    : null,
                isActive: form.isActive,
                isPromotional: form.isPromotional,
                priority: Number(form.priority) || 0,
                newUserOnly: form.newUserOnly,
            };

            coupon
                ? await graphqlClient.request<{ adminUpdateCoupon: Coupon }>(
                    ADMIN_UPDATE_COUPON,
                    { id: coupon.id, input }
                )
                : await graphqlClient.request<{ adminCreateCoupon: Coupon }>(
                    ADMIN_CREATE_COUPON,
                    { input }
                );

            onSaved();

            toast.success(
                coupon
                    ? "Coupon updated successfully."
                    : "Coupon created successfully."
            );

            onOpenChange(false);
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ??
                error?.message ??
                "Unable to save coupon."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                aria-labelledby={ids.title}
                aria-describedby={ids.desc}
                className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border-border bg-card p-0 shadow-xl sm:max-w-2xl"
            >
                <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Ticket className="h-4.5 w-4.5" aria-hidden="true" />
                        </span>

                        <div>
                            <DialogTitle id={ids.title} className="font-serif text-xl font-normal leading-tight">
                                {coupon ? "Edit Coupon" : "Create Coupon"}
                            </DialogTitle>

                            <DialogDescription id={ids.desc} className="text-xs text-muted-foreground">
                                Set the offer, eligibility, and promotion shown to customers.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form
                    onSubmit={submit}
                    noValidate
                    aria-busy={saving}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Scrollable form body */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="space-y-6">
                            <fieldset className="space-y-4">
                                <legend className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    <Tag className="h-3 w-3" aria-hidden="true" />
                                    Coupon details
                                </legend>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={ids.code}>
                                            Coupon Code <span aria-hidden="true">*</span>
                                        </Label>
                                        <Input
                                            id={ids.code}
                                            name="code"
                                            required
                                            aria-required="true"
                                            aria-invalid={!!errors.code}
                                            aria-describedby={ids.codeHint}
                                            value={form.code}
                                            onChange={(e) => set("code", e.target.value.toUpperCase())}
                                            placeholder="SUMMER40"
                                            className="h-11 rounded-xl font-mono uppercase tracking-wide"
                                        />
                                        <p
                                            id={ids.codeHint}
                                            className={`text-[11px] ${errors.code ? "font-medium text-destructive" : "text-muted-foreground"}`}
                                        >
                                            {errors.code ?? "Customers will enter this at checkout."}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={ids.campaignName}>Campaign Name</Label>
                                        <Input
                                            id={ids.campaignName}
                                            name="campaignName"
                                            value={form.campaignName}
                                            onChange={(e) => set("campaignName", e.target.value)}
                                            placeholder="Summer Sale"
                                            className="h-11 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={ids.description}>Description</Label>
                                    <Input
                                        id={ids.description}
                                        name="description"
                                        value={form.description}
                                        onChange={(e) => set("description", e.target.value)}
                                        placeholder="40% off summer collection"
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                            </fieldset>

                            <Separator />

                            <fieldset className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                                <legend className="mb-1 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    <Percent className="h-3 w-3" aria-hidden="true" />
                                    Discount settings
                                </legend>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={ids.discountType}>Discount Type</Label>

                                        <Select
                                            value={form.discountType}
                                            onValueChange={(v) => set("discountType", v)}
                                        >
                                            <SelectTrigger id={ids.discountType} className="h-11 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="PERCENTAGE">
                                                    <span className="flex items-center gap-1.5">
                                                        <Percent className="h-3.5 w-3.5" aria-hidden="true" />
                                                        Percentage (%)
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="FIXED">
                                                    <span className="flex items-center gap-1.5">
                                                        <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" />
                                                        Fixed (₹)
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={ids.discountValue}>
                                            Discount Value <span aria-hidden="true">*</span>
                                        </Label>
                                        <div className="relative">
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
                                            >
                                                {form.discountType === "PERCENTAGE" ? "%" : "₹"}
                                            </span>
                                            <Input
                                                id={ids.discountValue}
                                                name="discountValue"
                                                type="number"
                                                inputMode="decimal"
                                                min="0"
                                                step="0.01"
                                                required
                                                aria-required="true"
                                                aria-invalid={!!errors.discountValue}
                                                aria-describedby={ids.discountValueHint}
                                                value={form.discountValue}
                                                onChange={(e) => set("discountValue", e.target.value)}
                                                placeholder="40"
                                                className="h-11 rounded-xl pl-7"
                                            />
                                        </div>
                                        <p
                                            id={ids.discountValueHint}
                                            className={`text-[11px] ${errors.discountValue ? "font-medium text-destructive" : "text-muted-foreground"}`}
                                        >
                                            {errors.discountValue ??
                                                (form.discountType === "PERCENTAGE"
                                                    ? "Enter a value between 1 and 100."
                                                    : "Enter an amount in ₹.")}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={ids.minimumOrder}>Minimum Order (₹)</Label>
                                        <Input
                                            id={ids.minimumOrder}
                                            name="minimumOrder"
                                            type="number"
                                            inputMode="decimal"
                                            min="0"
                                            aria-describedby={ids.minimumOrderHint}
                                            value={form.minimumOrder}
                                            onChange={(e) => set("minimumOrder", e.target.value)}
                                            placeholder="Optional"
                                            className="h-11 rounded-xl"
                                        />
                                        <p id={ids.minimumOrderHint} className="sr-only">
                                            Leave blank for no minimum order requirement.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={ids.maximumDiscount}>Maximum Discount (₹)</Label>
                                        <Input
                                            id={ids.maximumDiscount}
                                            name="maximumDiscount"
                                            type="number"
                                            inputMode="decimal"
                                            min="0"
                                            disabled={form.discountType === "FIXED"}
                                            aria-describedby={ids.maximumDiscountHint}
                                            value={form.discountType === "FIXED" ? "" : form.maximumDiscount}
                                            onChange={(e) => set("maximumDiscount", e.target.value)}
                                            placeholder={form.discountType === "FIXED" ? "Not applicable" : "Optional"}
                                            className="h-11 rounded-xl disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <p id={ids.maximumDiscountHint} className="sr-only">
                                            Leave blank for no discount cap. Only applies to percentage discounts.
                                        </p>
                                    </div>
                                </div>

                                {offerSummary && (
                                    <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
                                        <Ticket className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                        <span>
                                            <span className="font-medium">
                                                {form.code.trim() || "This coupon"}
                                            </span>{" "}
                                            gives {offerSummary}.
                                        </span>
                                    </div>
                                )}
                            </fieldset>

                            <fieldset className="space-y-4">
                                <legend className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    <Users className="h-3 w-3" aria-hidden="true" />
                                    Usage &amp; eligibility
                                </legend>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={ids.usageLimit}>Usage Limit</Label>
                                        <Input
                                            id={ids.usageLimit}
                                            name="usageLimit"
                                            type="number"
                                            inputMode="numeric"
                                            min="1"
                                            aria-describedby={ids.usageLimitHint}
                                            value={form.usageLimit}
                                            onChange={(e) => set("usageLimit", e.target.value)}
                                            placeholder="Unlimited"
                                            className="h-11 rounded-xl"
                                        />
                                        <p id={ids.usageLimitHint} className="sr-only">
                                            Leave blank to allow unlimited redemptions.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={ids.expiresAt} className="flex items-center gap-1.5">
                                            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                            Expires On
                                        </Label>
                                        <Input
                                            id={ids.expiresAt}
                                            name="expiresAt"
                                            type="date"
                                            min={new Date().toISOString().slice(0, 10)}
                                            value={form.expiresAt}
                                            onChange={(e) => set("expiresAt", e.target.value)}
                                            className="h-11 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 transition-colors hover:border-border">
                                        <div>
                                            <Label htmlFor={ids.newUserOnly} className="text-sm font-medium">
                                                New users only
                                            </Label>
                                            <p id={ids.newUserOnlyHint} className="text-[11px] text-muted-foreground">
                                                First-order offer
                                            </p>
                                        </div>

                                        <Switch
                                            id={ids.newUserOnly}
                                            aria-describedby={ids.newUserOnlyHint}
                                            checked={form.newUserOnly}
                                            onCheckedChange={(v) => set("newUserOnly", v)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 transition-colors hover:border-border">
                                        <div>
                                            <Label htmlFor={ids.isActive} className="text-sm font-medium">
                                                Active coupon
                                            </Label>
                                            <p id={ids.isActiveHint} className="text-[11px] text-muted-foreground">
                                                Customers can redeem it
                                            </p>
                                        </div>

                                        <Switch
                                            id={ids.isActive}
                                            aria-describedby={ids.isActiveHint}
                                            checked={form.isActive}
                                            onCheckedChange={(v) => set("isActive", v)}
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                                <legend className="sr-only">Promotional bar settings</legend>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-start gap-2.5">
                                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
                                        </span>

                                        <div>
                                            <Label htmlFor={ids.isPromotional} className="text-sm font-semibold">
                                                Promotional Bar
                                            </Label>
                                            <p id={ids.isPromotionalHint} className="text-[11px] text-muted-foreground">
                                                Use this sale as the live announcement in the storefront navbar.
                                            </p>
                                        </div>
                                    </div>

                                    <Switch
                                        id={ids.isPromotional}
                                        aria-describedby={ids.isPromotionalHint}
                                        checked={form.isPromotional}
                                        onCheckedChange={(v) => set("isPromotional", v)}
                                    />
                                </div>

                                {form.isPromotional && (
                                    <div className="grid gap-4 sm:grid-cols-[1fr_120px] animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor={ids.promotionText}>Promotion Text</Label>
                                                <span
                                                    className={`text-[11px] tabular-nums ${form.promotionText.length > PROMOTION_TEXT_LIMIT
                                                        ? "font-medium text-destructive"
                                                        : "text-muted-foreground"
                                                        }`}
                                                >
                                                    {form.promotionText.length}/{PROMOTION_TEXT_LIMIT}
                                                </span>
                                            </div>
                                            <Input
                                                id={ids.promotionText}
                                                name="promotionText"
                                                aria-describedby={ids.promotionTextHint}
                                                value={form.promotionText}
                                                onChange={(e) => set("promotionText", e.target.value)}
                                                placeholder="Summer Sale — Up to 40% off!"
                                                className="h-11 rounded-xl"
                                            />
                                            <p id={ids.promotionTextHint} className="sr-only">
                                                Keep it short so it fits comfortably in the navbar.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={ids.priority}>Priority</Label>
                                            <Input
                                                id={ids.priority}
                                                name="priority"
                                                type="number"
                                                inputMode="numeric"
                                                value={form.priority}
                                                onChange={(e) => set("priority", e.target.value)}
                                                className="h-11 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                )}
                            </fieldset>
                        </div>
                    </div>

                    <DialogFooter className="shrink-0 border-t border-border/60 bg-transparent px-6 py-6 sm:justify-end">
                        <span id={ids.status} role="status" aria-live="polite" className="sr-only">
                            {saving ? "Saving coupon…" : ""}
                        </span>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                            className="h-10 rounded-xl"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={saving}
                            aria-describedby={ids.status}
                            className="h-10 min-w-38 rounded-xl px-6"
                        >
                            {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />}
                            {saving ? "Saving..." : coupon ? "Save Changes" : "Create Coupon"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}