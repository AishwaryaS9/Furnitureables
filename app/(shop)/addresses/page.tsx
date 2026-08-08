import { Metadata } from "next";
import AddressList from "@/components/address/AddressList";
import { MapPin, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "My Delivery Addresses",
    description:
        "Manage your saved shipping and delivery addresses for quick white-glove checkout.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AddressesPage() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background focus:outline-none"
        >
            <section
                aria-labelledby="addresses-page-heading"
                className="mx-auto max-w-360 px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8"
            >
                {/* Editorial Header Block */}
                <header className="mb-8 sm:mb-12 border-b border-border/60 pb-6 sm:pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary border border-border/60 text-primary shrink-0">
                                <MapPin className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                Account Settings
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-[11px] font-mono text-muted-foreground">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            <span>Verified Destinations</span>
                        </div>
                    </div>

                    <h1
                        id="addresses-page-heading"
                        className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-foreground"
                    >
                        Saved Delivery Destinations
                    </h1>

                    <p className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                        Manage your dispatch locations for white-glove delivery and expedited checkout. Configure default addresses or add new destinations to your profile.
                    </p>
                </header>

                {/* Address List Component Feed */}
                <div className="space-y-6">
                    <AddressList />
                </div>
            </section>
        </main>
    );
}


