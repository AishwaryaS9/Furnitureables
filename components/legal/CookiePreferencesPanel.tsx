"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COOKIE_CATEGORIES } from "@/lib/data";
import { CookieCategory } from "@/types/legal";

const STORAGE_KEY = "furnitureables_cookie_preferences";

const defaultPreferences: Record<CookieCategory, boolean> = {
    functional: true,
    analytics: true,
    marketing: false,
};

function Toggle({ checked, onChange, disabled = false, ariaLabelledBy, ariaDescribedBy }: {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    ariaLabelledBy: string;
    ariaDescribedBy: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            disabled={disabled}
            onClick={onChange}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer ${checked ? "bg-primary" : "bg-muted"
                }`}
        >
            <span
                aria-hidden="true"
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"
                    }`}
            />
        </button>
    );
}

export default function CookiePreferencesPanel() {
    const [preferences, setPreferences] = useState(defaultPreferences);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
            }
        } catch {
            // Ignore malformed/inaccessible storage — fall back to defaults.
        } finally {
            setLoaded(true);
        }
    }, []);

    const toggle = (category: CookieCategory) => {
        setPreferences((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    const savePreferences = (next: Record<CookieCategory, boolean>) => {
        setPreferences(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // Storage unavailable fallback
        }
        toast.success("Your cookie preferences have been saved.");
    };

    const handleSave = () => savePreferences(preferences);

    const handleAcceptAll = () =>
        savePreferences({ functional: true, analytics: true, marketing: true });

    const handleRejectNonEssential = () =>
        savePreferences({ functional: false, analytics: false, marketing: false });

    if (!loaded) {
        return (
            <div
                aria-busy="true"
                aria-live="polite"
                className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 animate-pulse h-64"
            >
                <span className="sr-only">Loading cookie preferences...</span>
            </div>
        );
    }

    return (
        <form
            aria-label="Cookie preferences customizer"
            onSubmit={(e) => e.preventDefault()}
            className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 space-y-6"
        >
            {/* Essential cookies — always on */}
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-border/40">
                <div className="flex items-start gap-3">
                    <div
                        className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
                        aria-hidden="true"
                    >
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                        <h3 id="cat-essential-title" className="text-sm font-semibold text-foreground">
                            Essential Cookies
                        </h3>
                        <p
                            id="cat-essential-desc"
                            className="text-xs text-muted-foreground font-light leading-relaxed max-w-md"
                        >
                            Required for core functionality like sign-in, cart, and checkout. These
                            cannot be disabled.
                        </p>
                    </div>
                </div>
                <Toggle
                    checked
                    disabled
                    onChange={() => { }}
                    ariaLabelledBy="cat-essential-title"
                    ariaDescribedBy="cat-essential-desc"
                />
            </div>

            {/* Configurable categories */}
            <fieldset className="space-y-5 border-0 p-0 m-0">
                <legend className="sr-only">Configurable Cookie Categories</legend>
                {COOKIE_CATEGORIES.map((cat) => {
                    const titleId = `cat-${cat.id}-title`;
                    const descId = `cat-${cat.id}-desc`;

                    return (
                        <div key={cat.id} className="flex items-start justify-between gap-4">
                            <div className="space-y-0.5">
                                <h3 id={titleId} className="text-sm font-semibold text-foreground">
                                    {cat.title}
                                </h3>
                                <p
                                    id={descId}
                                    className="text-xs text-muted-foreground font-light leading-relaxed max-w-md"
                                >
                                    {cat.description}
                                </p>
                            </div>
                            <Toggle
                                checked={preferences[cat.id]}
                                onChange={() => toggle(cat.id)}
                                ariaLabelledBy={titleId}
                                ariaDescribedBy={descId}
                            />
                        </div>
                    );
                })}
            </fieldset>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2" role="group" aria-label="Cookie consent options">
                <Button
                    type="button"
                    onClick={handleSave}
                    aria-label="Save current cookie preferences"
                    className="h-9 px-5 text-xs font-semibold rounded-xl gap-1.5 cursor-pointer"
                >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Save Preferences
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAcceptAll}
                    aria-label="Accept all functional, analytics, and marketing cookies"
                    className="h-9 px-5 text-xs font-semibold rounded-xl cursor-pointer"
                >
                    Accept All
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRejectNonEssential}
                    aria-label="Reject all non-essential cookies"
                    className="h-9 px-5 text-xs font-semibold rounded-xl cursor-pointer"
                >
                    Reject Non-Essential
                </Button>
            </div>
        </form>
    );
}