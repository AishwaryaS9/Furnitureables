"use client";

import { useMemo, useState } from "react";
import { Country } from "country-state-city";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneCodeSelectProps {
    value: string;
    onChange: (value: string) => void;
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
}: PhoneCodeSelectProps) {
    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const term = search.toLowerCase();

        return countries.filter(
            (country) =>
                country.name
                    .toLowerCase()
                    .includes(term) ||
                country.phoneCode.includes(term) ||
                country.isoCode
                    .toLowerCase()
                    .includes(term)
        );
    }, [search]);

    const selected =
        countries.find(
            (country) =>
                country.phoneCode === value
        ) ?? null;

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                    />
                }
            >
                {selected ? selected.phoneCode : "Code"}

                <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2">
                <Input
                    placeholder="Search country or code..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="mb-2"
                />

                <div className="max-h-72 overflow-y-auto">
                    {filtered.map((country) => (
                        <button
                            key={country.isoCode}
                            type="button"
                            onClick={() => {
                                onChange(country.phoneCode);
                                setOpen(false);
                                setSearch("");
                            }}
                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-muted transition-colors"
                        >
                            <div>
                                <p className="text-sm font-medium">
                                    {country.name}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    {country.phoneCode}
                                </p>
                            </div>

                            <Check
                                className={cn(
                                    "h-4 w-4",
                                    value === country.phoneCode
                                        ? "opacity-100"
                                        : "opacity-0"
                                )}
                            />
                        </button>
                    ))}

                    {!filtered.length && (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No country found.
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}