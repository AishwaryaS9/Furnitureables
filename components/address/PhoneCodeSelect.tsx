"use client";

import { useMemo, useState } from "react";
import { Country } from "country-state-city";
import ReactCountryFlag from "react-country-flag";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneCodeSelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const countries = Country.getAllCountries()
    .map((country) => ({
        name: country.name,
        isoCode: country.isoCode,
        phoneCode: `+${country.phonecode}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

export default function PhoneCodeSelect({
    value,
    onChange,
    disabled = false,
}: PhoneCodeSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (!term) return countries;

        return countries.filter(
            (country) =>
                country.name.toLowerCase().includes(term) ||
                country.phoneCode.includes(term) ||
                country.isoCode.toLowerCase().includes(term)
        );
    }, [search]);

    const selected =
        countries.find(
            (country) => country.phoneCode === value
        ) ?? null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        aria-expanded={open}
                        aria-label="Select international phone code"
                        className={cn(
                            "h-10 w-full min-w-25 flex items-center justify-between gap-2 rounded-xl border border-input bg-secondary/30 px-3 text-xs transition-all",
                            "hover:bg-secondary/50 focus-visible:ring-1 focus-visible:ring-ring cursor-pointer",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            open && "ring-1 ring-ring border-ring"
                        )}
                    />
                }
            >
                <div className="flex items-center gap-2 truncate">
                    {selected ? (
                        <ReactCountryFlag
                            countryCode={selected.isoCode}
                            svg
                            style={{
                                width: "1.1rem",
                                height: "1.1rem",
                                borderRadius: "2px",
                                objectFit: "cover",
                            }}
                            aria-hidden="true"
                        />
                    ) : (
                        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                    )}

                    <span className="font-semibold text-foreground tracking-tight whitespace-nowrap">
                        {selected ? selected.phoneCode : "+91"}
                    </span>
                </div>

                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
            </PopoverTrigger>

            <PopoverContent
                className="w-75 p-2.5 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl"
                align="start"
            >
                <Input
                    placeholder="Search country or code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 text-xs bg-secondary/30 border-input rounded-xl mb-2 focus-visible:ring-1 focus-visible:ring-ring"
                />

                <div className="max-h-64 overflow-y-auto space-y-1 p-0.5">
                    {filtered.map((country) => {
                        const isSelected = value === country.phoneCode;

                        return (
                            <button
                                key={`${country.isoCode}-${country.phoneCode}`}
                                type="button"
                                onClick={() => {
                                    onChange(country.phoneCode);
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors cursor-pointer text-xs",
                                    "hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring",
                                    isSelected && "bg-secondary font-medium"
                                )}
                            >
                                <div className="flex items-center gap-3 truncate">
                                    <ReactCountryFlag
                                        countryCode={country.isoCode}
                                        svg
                                        style={{
                                            width: "1.1rem",
                                            height: "1.1rem",
                                            borderRadius: "2px",
                                            objectFit: "cover",
                                        }}
                                        aria-hidden="true"
                                    />

                                    <div className="truncate min-w-0">
                                        <p className="text-xs font-medium text-foreground truncate">
                                            {country.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-mono">
                                            {country.phoneCode}
                                        </p>
                                    </div>
                                </div>

                                <Check
                                    className={cn(
                                        "h-3.5 w-3.5 text-primary shrink-0 transition-opacity ml-2",
                                        isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                    aria-hidden="true"
                                />
                            </button>
                        );
                    })}

                    {!filtered.length && (
                        <p className="py-6 text-center text-xs text-muted-foreground font-light">
                            No country or dialing code matches search.
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}