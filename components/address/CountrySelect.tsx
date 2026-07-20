"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Country } from "country-state-city";
import ReactCountryFlag from "react-country-flag";
import { cn } from "@/lib/utils";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface CountrySelectProps {
    value?: string;

    onChange: (value: string) => void;

    disabled?: boolean;
}

const countries = Country.getAllCountries();

export default function CountrySelect({
    value,
    onChange,
    disabled,
}: CountrySelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedCountry = countries.find(
        (country) => country.name === value
    );

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                    {selectedCountry && (
                        <ReactCountryFlag
                            countryCode={selectedCountry.isoCode}
                            svg
                            style={{
                                width: "1.25rem",
                                height: "1.25rem",
                            }}
                        />
                    )}

                    <span>
                        {selectedCountry?.name ?? "Select Country"}
                    </span>
                </div>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </PopoverTrigger>
            <PopoverContent
                className="w-100 p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder="Search country..." />

                    <CommandList>
                        <CommandEmpty>
                            No country found.
                        </CommandEmpty>

                        <CommandGroup>
                            {countries.map((country) => (
                                <CommandItem
                                    key={country.isoCode}
                                    value={country.name}
                                    onSelect={() => {
                                        onChange(country.name);

                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === country.name
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <div className="flex items-center gap-3">
                                        <ReactCountryFlag
                                            countryCode={country.isoCode}
                                            svg
                                            style={{
                                                width: "1.25rem",
                                                height: "1.25rem",
                                            }}
                                        />

                                        <span>{country.name}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}