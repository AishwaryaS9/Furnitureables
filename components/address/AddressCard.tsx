"use client";

import { Address } from "@/types/address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle2, MapPin, Phone, User } from "lucide-react";

interface AddressCardProps {
    address: Address;

    onEdit?: () => void;

    onDelete?: () => void;

    onSetDefault?: () => void;

    selectable?: boolean;

    selected?: boolean;

    onSelect?: () => void;
}

export default function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetDefault,
    selectable = false,
    selected = false,
    onSelect,
}: AddressCardProps) {
    return (
        <div
            onClick={selectable ? onSelect : undefined}
            className={`rounded-2xl border bg-white p-6 transition-all 
                ${selected
                    ? "border-zinc-900 ring-2 ring-zinc-900/10"
                    : "border-zinc-200"
                }

                ${selectable
                    ? "cursor-pointer hover:border-zinc-900"
                    : ""
                }
            `}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">

                    <div className="flex items-center gap-2">

                        <User className="h-4 w-4 text-zinc-500" />

                        <h3 className="font-semibold">
                            {address.fullName}
                        </h3>

                    </div>

                    <div className="flex items-center gap-2 text-sm text-zinc-600">

                        <Phone className="h-4 w-4" />

                        {address.phone}

                    </div>

                </div>

                {address.isDefault && (
                    <Badge>
                        Default
                    </Badge>
                )}
            </div>

            <div className="mt-5 flex items-start gap-2 text-sm text-zinc-700">

                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                <div>

                    <p>{address.addressLine1}</p>

                    {address.addressLine2 && (
                        <p>{address.addressLine2}</p>
                    )}

                    {address.landmark && (
                        <p>{address.landmark}</p>
                    )}

                    <p>
                        {address.city}, {address.state}
                    </p>

                    <p>{address.postalCode}</p>

                    <p>{address.country}</p>

                </div>

            </div>

            {!selectable && (
                <div className="mt-6 flex flex-wrap gap-2">

                    {!address.isDefault && (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={onSetDefault}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />

                            Set Default
                        </Button>
                    )}

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onEdit}
                    >
                        <Pencil className="mr-2 h-4 w-4" />

                        Edit
                    </Button>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={onDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />

                        Delete
                    </Button>

                </div>
            )}
        </div>
    );
}