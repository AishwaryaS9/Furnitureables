"use client";

import { Check } from "lucide-react";
import { PaymentMethod } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { METHODS } from "@/lib/data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentMethodProps {
    value: PaymentMethod;
    onChange: (value: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
    value,
    onChange,
}: PaymentMethodProps) {
    return (
        <section
            aria-labelledby="payment-method-heading"
            className="space-y-5"
        >
            {/* Section Header */}
            <div className="border-b border-border/50 pb-4">
                <h2
                    id="payment-method-heading"
                    className="text-lg sm:text-xl font-serif font-normal tracking-tight text-foreground"
                >
                    Payment Method
                </h2>
                <p className="text-xs text-muted-foreground font-light">
                    Select your preferred payment gateway for order authorization
                </p>
            </div>

            {/* Shadcn Radio Group Container */}
            <RadioGroup
                value={value}
                onValueChange={(val) => onChange(val as PaymentMethod)}
                className="space-y-3"
                aria-label="Payment method selection"
            >
                {METHODS.map((method) => {
                    const isSelected = value === method.id;
                    const Icon = method.icon;

                    return (
                        <Card
                            key={method.id}
                            onClick={() => onChange(method.id as PaymentMethod)}
                            className={cn(
                                "group relative w-full p-4 sm:p-5 rounded-2xl transition-all duration-300 text-left cursor-pointer outline-none",
                                "bg-card text-card-foreground shadow-2xs",
                                isSelected
                                    ? "border-primary ring-1 ring-primary/20 shadow-xs"
                                    : "border-border/60 hover:shadow-sm"
                            )}
                        >
                            <Label
                                htmlFor={`payment-method-${method.id}`}
                                className="flex items-start justify-between cursor-pointer w-full"
                            >
                                <div className="flex items-start gap-3.5 min-w-0 pr-2">
                                    {/* Visual Icon Badge */}
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors mt-0.5",
                                            isSelected
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-secondary border-border/80 text-muted-foreground group-hover:text-foreground"
                                        )}
                                        aria-hidden="true"
                                    >
                                        <Icon className="w-5 h-5 stroke-[1.75]" />
                                    </div>

                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-sm sm:text-base text-foreground tracking-tight">
                                                {method.title}
                                            </span>

                                            {method.badge && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] font-mono font-medium tracking-wider uppercase px-2 py-0.5 rounded-full border-border/50 text-muted-foreground"
                                                >
                                                    {method.badge}
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                            {method.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Shadcn Radio Item with Custom Checked Indicator */}
                                <div className="relative flex items-center justify-center mt-1">
                                    <RadioGroupItem
                                        value={method.id}
                                        id={`payment-method-${method.id}`}
                                        className="sr-only"
                                    />
                                    <div
                                        className={cn(
                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                                            isSelected
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-muted-foreground/40 bg-card group-hover:border-primary/60"
                                        )}
                                        aria-hidden="true"
                                    >
                                        {isSelected && <Check className="h-3.5 w-3.5 stroke-3" />}
                                    </div>
                                </div>
                            </Label>
                        </Card>
                    );
                })}
            </RadioGroup>
        </section>
    );
}