"use client";

import * as React from "react";
import { City, Country, State } from "country-state-city";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

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
    disabled,
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

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm">
                {value || "Select city"}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </PopoverTrigger>

            <PopoverContent
                className="w-100 p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder="Search city..." />

                    <CommandList>
                        <CommandEmpty>
                            No city found.
                        </CommandEmpty>

                        <CommandGroup>
                            {cities.map((city) => (
                                <CommandItem
                                    key={`${city.name}-${city.latitude}-${city.longitude}`}
                                    value={city.name}
                                    onSelect={() => {
                                        onChange(city.name);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === city.name
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />

                                    {city.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}