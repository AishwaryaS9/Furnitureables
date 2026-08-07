"use client";

import { Address } from "@/types/address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle2, MapPin, Phone, User, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressCardProps {
    address: Address;
    mode?: "manage" | "select";
    selected?: boolean;
    onSelect?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onSetDefault?: () => void;
}

export default function AddressCard({ address, mode, onEdit, onDelete, onSetDefault, selected = false, onSelect }: AddressCardProps) {
    const isSelectMode = mode === "select";

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (isSelectMode && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onSelect?.();
        }
    };

    return (
        <div
            role={isSelectMode ? "radio" : "region"}
            aria-checked={isSelectMode ? selected : undefined}
            aria-label={`Address for ${address.fullName}`}
            tabIndex={isSelectMode ? 0 : -1}
            onClick={isSelectMode ? onSelect : undefined}
            onKeyDown={handleKeyDown}
            className={cn(
                "group relative flex flex-col justify-between rounded-2xl border p-5 sm:p-6 transition-all duration-300 outline-none",
                "bg-card text-card-foreground shadow-2xs",

                isSelectMode && [
                    "cursor-pointer hover:border-border hover:shadow-2xs",
                    selected
                        ? "border-primary ring-1 ring-primary/20 shadow-xs"
                        : "border-border/60 hover:shadow-sm"
                ],

                !isSelectMode && "border-border/60 hover:border-border hover:shadow-xs"
            )}
        >
            <div>
                {/* Card Header: User Info & Status Badges */}
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                            {isSelectMode && (
                                <div
                                    className={cn(
                                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all",
                                        selected
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted-foreground/40 bg-card group-hover:border-primary/60"
                                    )}
                                >
                                    {selected && <Check className="h-3 w-3 stroke-3" aria-hidden="true" />}
                                </div>
                            )}
                            <User className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                            <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                                {address.fullName}
                            </h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span>{address.phoneCode} {address.phone}</span>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {isSelectMode ? (
                            selected && (
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-primary/20 text-[10px] uppercase font-semibold tracking-wider">
                                    Selected
                                </Badge>
                            )
                        ) : (
                            address.isDefault && (
                                <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-[10px] uppercase font-semibold tracking-wider">
                                    Default
                                </Badge>
                            )
                        )}
                    </div>
                </div>

                {/* Address Body */}
                <div className="mt-4 pt-3 border-t border-border/40 flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                    <div className="space-y-0.5 leading-relaxed">
                        <p className="font-medium text-foreground">{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        {address.landmark && (
                            <p className="text-xs text-muted-foreground/80">Landmark: {address.landmark}</p>
                        )}
                        <p>
                            {address.city}, {address.state} — <span className="font-mono">{address.postalCode}</span>
                        </p>
                        <p className="text-xs text-muted-foreground/80 font-medium uppercase tracking-wider">{address.country}</p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="mt-5 pt-3 border-t border-border/40 flex flex-wrap items-center justify-end gap-2">
                {isSelectMode ? (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.();
                        }}
                        aria-label={`Edit address for ${address.fullName}`}
                        className="h-8 px-3 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
                    >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                        Edit
                    </Button>
                ) : (
                    <>
                        {!address.isDefault && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onSetDefault}
                                className="h-8 px-3 text-xs font-medium rounded-xl border-border bg-card hover:bg-secondary cursor-pointer"
                            >
                                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                Set Default
                            </Button>
                        )}

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onEdit}
                            className="h-8 px-3 text-xs font-medium rounded-xl border-border bg-card hover:bg-secondary cursor-pointer"
                        >
                            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onDelete}
                            className="h-8 px-3 text-xs font-medium rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}