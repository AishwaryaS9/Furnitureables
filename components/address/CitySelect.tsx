"use client";

import * as React from "react";
import { City, Country, State } from "country-state-city";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface CitySelectProps {
    country: string;
    state: string;
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function CitySelect({
    country,
    state,
    value,
    onChange,
    disabled = false,
}: CitySelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedCountry = Country.getAllCountries().find(
        (c) => c.name === country
    );

    const selectedState = React.useMemo(() => {
        if (!selectedCountry) return undefined;

        return State.getStatesOfCountry(
            selectedCountry.isoCode
        ).find((s) => s.name === state);
    }, [country, state, selectedCountry]);

    const cities = React.useMemo(() => {
        if (!selectedCountry || !selectedState) {
            return [];
        }

        return City.getCitiesOfState(
            selectedCountry.isoCode,
            selectedState.isoCode
        );
    }, [selectedCountry, selectedState]);

    React.useEffect(() => {
        if (!value) return;

        const exists = cities.some(
            (city) => city.name === value
        );

        if (!exists) {
            onChange("");
        }
    }, [cities, value, onChange]);

    const isDisabled = disabled || !state || cities.length === 0;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                disabled={isDisabled}
                aria-expanded={open}
                aria-label="Select city"
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-xl border border-input bg-secondary/30 px-3 py-2 text-xs transition-all",
                    "hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-ring cursor-pointer",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    open && "ring-1 ring-ring border-ring"
                )}
            >
                <div className="flex items-center gap-2 truncate">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                    <span className={cn("truncate font-medium", !value && "text-muted-foreground")}>
                        {value || (!state ? "Select State First" : "Select City")}
                    </span>
                </div>

                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
            </PopoverTrigger>

            <PopoverContent
                className="w-(--radix-popover-trigger-width) min-w-60 p-0 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl"
                align="start"
            >
                <Command className="rounded-2xl">
                    <CommandInput
                        placeholder="Search city..."
                        className="h-10 text-xs border-none focus:ring-0"
                    />

                    <CommandList className="max-h-60 overflow-y-auto p-1">
                        <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
                            No city found.
                        </CommandEmpty>

                        <CommandGroup>
                            {cities.map((city) => {
                                const isSelected = value === city.name;

                                return (
                                    <CommandItem
                                        key={`${city.name}-${city.latitude}-${city.longitude}`}
                                        value={city.name}
                                        onSelect={() => {
                                            onChange(city.name);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between rounded-xl px-2.5 py-2 text-xs cursor-pointer transition-colors",
                                            "aria-selected:bg-secondary aria-selected:text-foreground hover:bg-secondary"
                                        )}
                                    >
                                        <span className="truncate font-medium">{city.name}</span>

                                        <Check
                                            className={cn(
                                                "h-3.5 w-3.5 text-primary shrink-0 transition-opacity ml-2",
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