"use client";

import * as React from "react";
import { State, Country } from "country-state-city";
import { Check, ChevronsUpDown, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

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
  disabled = false,
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

  const isDisabled = disabled || !country || states.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={isDisabled}
        aria-expanded={open}
        aria-label="Select state"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-xl border border-input bg-secondary/30 px-3 py-2 text-xs transition-all",
          "hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-ring cursor-pointer",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-1 ring-ring border-ring"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <Map className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
          <span className={cn("truncate font-medium", !value && "text-muted-foreground")}>
            {value || (!country ? "Select Country First" : "Select State")}
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
            placeholder="Search state..."
            className="h-10 text-xs border-none focus:ring-0"
          />

          <CommandList className="max-h-60 overflow-y-auto p-1">
            <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
              No state found.
            </CommandEmpty>

            <CommandGroup>
              {states.map((state) => {
                const isSelected = value === state.name;

                return (
                  <CommandItem
                    key={`${state.isoCode}-${state.name}`}
                    value={state.name}
                    onSelect={() => {
                      onChange(state.name);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-2.5 py-2 text-xs cursor-pointer transition-colors",
                      "aria-selected:bg-secondary aria-selected:text-foreground hover:bg-secondary"
                    )}
                  >
                    <span className="truncate font-medium">{state.name}</span>

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