"use client";

import { MapPinPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAddressProps {
    onAdd: () => void;
}

export default function EmptyAddress({
    onAdd,
}: EmptyAddressProps) {
    return (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <MapPinPlus className="h-7 w-7 text-zinc-500" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
                No saved addresses
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
                Save your delivery addresses here for faster checkout.
            </p>

            <Button
                className="mt-6"
                onClick={onAdd}
            >
                Add Address
            </Button>

        </div>
    );
}