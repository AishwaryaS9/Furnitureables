"use client";

import { useState } from "react";
import { Plus, MapPin, Building2, Lock } from "lucide-react";
import { Address } from "@/types/address";
import { Button } from "@/components/ui/button";
import AddressCard from "@/components/address/AddressCard";
import AddressDialog from "@/components/address/AddressDialog";
import { toast } from "sonner";
import { MAX_ADDRESSES } from "@/lib/constants/address";

interface AddressSelectorProps {
    addresses: Address[];
    selectedAddressId?: string;
    onSelect: (id: string) => void;
}

export default function AddressSelector({
    addresses,
    selectedAddressId,
    onSelect,
}: AddressSelectorProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address>();

    const isMaxReached = addresses.length >= MAX_ADDRESSES;

    function handleAdd() {
        if (isMaxReached) {
            toast.error(`You can only save a maximum of ${MAX_ADDRESSES} addresses.`);
            return;
        }
        setEditingAddress(undefined);
        setDialogOpen(true);
    }

    function handleEdit(address: Address) {
        setEditingAddress(address);
        setDialogOpen(true);
    }

    // 1. Empty State
    if (!addresses.length) {
        return (
            <div
                role="region"
                aria-label="No shipping address saved"
                className="relative overflow-hidden rounded-3xl border border-dashed border-border/80 bg-linear-to-b from-card to-secondary/30 p-8 sm:p-12 text-center space-y-5 shadow-xs"
            >
                <div
                    className="w-16 h-16 rounded-2xl bg-secondary/80 border border-border/80 flex items-center justify-center text-muted-foreground mx-auto shadow-xs"
                    aria-hidden="true"
                >
                    <Building2 className="w-7 h-7 stroke-[1.25]" />
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                    <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-foreground">
                        No saved addresses
                    </h2>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                        Please add a destination address to calculate delivery timelines and dispatch your order.
                    </p>
                </div>

                <div className="pt-2">
                    <Button
                        onClick={handleAdd}
                        className="h-11 px-6 text-xs font-semibold tracking-wider uppercase rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 group"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        <span>Add Delivery Address</span>
                    </Button>
                </div>

                <AddressDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={(address) => {
                        onSelect(address.id);
                    }}
                />
            </div>
        );
    }

    // 2. Active Card Feed View
    return (
        <section aria-labelledby="address-selector-heading" className="space-y-6">

            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                        <h2 id="address-selector-heading" className="text-lg sm:text-xl font-serif font-normal tracking-tight text-foreground">
                            Shipping Destination
                        </h2>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">
                        Choose where your curated architectural pieces should be delivered (Max {MAX_ADDRESSES})
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border border-border/60 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                        <MapPin className="w-3 h-3 text-primary" aria-hidden="true" />
                        {addresses.length}/{MAX_ADDRESSES} Saved
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAdd}
                        disabled={isMaxReached}
                        className="h-9 px-3.5 text-xs font-medium rounded-xl border-border bg-card text-foreground hover:bg-secondary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                    >
                        <Plus className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                        <span>Add Address</span>
                    </Button>
                </div>
            </div>

            {/* Grid Feed */}
            <div
                role="radiogroup"
                aria-label="Saved shipping addresses"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {addresses.map((address) => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        mode="select"
                        selected={address.id === selectedAddressId}
                        onSelect={() => onSelect(address.id)}
                        onEdit={() => handleEdit(address)}
                    />
                ))}

                {/* Add Address Action Card Tile (Disabled when 3 addresses exist) */}
                {!isMaxReached ? (
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="group relative flex flex-col items-center justify-center min-h-40 p-6 rounded-2xl border-2 border-dashed border-border/60 bg-secondary/20 hover:bg-secondary/50 hover:border-border transition-all duration-300 text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-ring"
                    >
                        <div className="w-10 h-10 rounded-xl bg-card border border-border/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all shadow-2xs mb-2">
                            <Plus className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
                        </div>
                        <span className="text-xs font-semibold text-foreground tracking-tight">
                            Add Another Address
                        </span>
                        <span className="text-[11px] text-muted-foreground font-light mt-0.5">
                            ({addresses.length} of {MAX_ADDRESSES} slots used)
                        </span>
                    </button>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-40 p-6 rounded-2xl border border-border/40 bg-secondary/10 text-center opacity-60">
                        <div className="w-10 h-10 rounded-xl bg-secondary border border-border/60 flex items-center justify-center text-muted-foreground mb-2">
                            <Lock className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground tracking-tight">
                            Address Limit Reached
                        </span>
                        <span className="text-[11px] text-muted-foreground/80 font-light mt-0.5">
                            Maximum of {MAX_ADDRESSES} saved addresses allowed
                        </span>
                    </div>
                )}
            </div>

            {/* Address Dialog Modal */}
            <AddressDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                address={editingAddress}
                onSuccess={(address) => {
                    onSelect(address.id);
                }}
            />

        </section>
    );
}