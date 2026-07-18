"use client";

import * as React from "react";

import { State, Country } from "country-state-city";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

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

interface StateSelectProps {
  country: string;

  value?: string;

  onChange: (value: string) => void;

  disabled?: boolean;
}

export default function StateSelect({
  country,
  value,
  onChange,
  // disabled,
}: StateSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCountry = Country.getAllCountries().find(
    (c) => c.name === country
  );

  const states = React.useMemo(() => {
    if (!selectedCountry) return [];

    return State.getStatesOfCountry(
      selectedCountry.isoCode
    );
  }, [selectedCountry]);

  React.useEffect(() => {
    if (!value) return;

    const exists = states.some(
      (state) => state.name === value
    );

    if (!exists) {
      onChange("");
    }
  }, [states, value, onChange]);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm">
        {value || "Select state"}
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        className="w-100 p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search state..." />

          <CommandList>
            <CommandEmpty>
              No state found.
            </CommandEmpty>

            <CommandGroup>
              {states.map((state) => (
                <CommandItem
                  key={state.isoCode}
                  value={state.name}
                  onSelect={() => {
                    onChange(state.name);

                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === state.name
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  {state.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}