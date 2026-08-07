"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { Country } from "country-state-city";
import ReactCountryFlag from "react-country-flag";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CountrySelectProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const countries = Country.getAllCountries();

export default function CountrySelect({
    value,
    onChange,
    disabled = false,
}: CountrySelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedCountry = countries.find(
        (country) => country.name === value
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                disabled={disabled}
                aria-expanded={open}
                aria-label="Select country"
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-xl border border-input bg-secondary/30 px-3 py-2 text-xs transition-all",
                    "hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-ring cursor-pointer",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    open && "ring-1 ring-ring border-ring"
                )}
            >
                <div className="flex items-center gap-2.5 truncate">
                    {selectedCountry ? (
                        <ReactCountryFlag
                            countryCode={selectedCountry.isoCode}
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
                        <Globe className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                    )}

                    <span className={cn("truncate font-medium", !selectedCountry && "text-muted-foreground")}>
                        {selectedCountry?.name ?? "Select Country"}
                    </span>
                </div>

                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
            </PopoverTrigger>

            <PopoverContent
                className="w-(--radix-popover-trigger-width) min-w-70 p-0 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl"
                align="start"
            >
                <Command className="rounded-2xl">
                    <CommandInput
                        placeholder="Search country..."
                        className="h-10 text-xs border-none focus:ring-0"
                    />

                    <CommandList className="max-h-60 overflow-y-auto p-1">
                        <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
                            No country found.
                        </CommandEmpty>

                        <CommandGroup>
                            {countries.map((country) => {
                                const isSelected = value === country.name;

                                return (
                                    <CommandItem
                                        key={country.isoCode}
                                        value={country.name}
                                        onSelect={() => {
                                            onChange(country.name);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between rounded-xl px-2.5 py-2 text-xs cursor-pointer transition-colors",
                                            "aria-selected:bg-secondary aria-selected:text-foreground hover:bg-secondary"
                                        )}
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
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
                                            <span className="truncate font-medium">{country.name}</span>
                                        </div>

                                        <Check
                                            className={cn(
                                                "h-3.5 w-3.5 text-primary shrink-0 transition-opacity",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                            aria-hidden="true"
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}