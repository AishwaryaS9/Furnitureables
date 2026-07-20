"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Address } from "@/types/address";
import { Button } from "@/components/ui/button";
import AddressCard from "@/components/address/AddressCard";
import AddressDialog from "@/components/address/AddressDialog";

interface AddressSelectorProps {
    addresses: Address[];
    selectedAddressId?: string;
    onSelect: (id: string) => void;
}

export default function AddressSelector({ addresses, selectedAddressId, onSelect }: AddressSelectorProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address>();

    function handleAdd() {
        setEditingAddress(undefined);

        setDialogOpen(true);
    }

    function handleEdit(address: Address) {
        setEditingAddress(address);

        setDialogOpen(true);
    }

    if (!addresses.length) {
        return (
            <div className="rounded-xl border border-dashed p-8 text-center">
                <h2 className="text-lg font-semibold">
                    No saved addresses.
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Add an address to continue with
                    checkout.
                </p>

                <Button
                    className="mt-6"
                    onClick={handleAdd}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Address
                </Button>

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

    return (
        <section className="space-y-5">

            <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold">
                    Delivery Address
                </h2>

                <p className="text-sm text-muted-foreground">
                    Select one address
                </p>

                <Button
                    variant="outline"
                    onClick={handleAdd}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Address
                </Button>

            </div>

            <div className="space-y-4">

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

            </div>

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