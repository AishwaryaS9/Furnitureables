"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Address, AddressInput } from "@/types/address";
import { addressSchema, AddressFormValues } from "@/lib/validations/address";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import CountrySelect from "./CountrySelect";
import StateSelect from "./StateSelect";
import CitySelect from "./CitySelect";
import PhoneCodeSelect from "./PhoneCodeSelect";

interface Props {
  initialValues?: Address;
  loading?: boolean;
  onSubmit: (values: AddressInput) => void;
}

export default function AddressForm({
  initialValues,
  loading = false,
  onSubmit,
}: Props) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),

    defaultValues: {
      fullName: "",
      phoneCode: "+91",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (!initialValues) {
      form.reset();
      return;
    }

    form.reset({
      fullName: initialValues.fullName,
      phoneCode: initialValues.phoneCode,
      phone: initialValues.phone,
      addressLine1: initialValues.addressLine1,
      addressLine2: initialValues.addressLine2 ?? "",
      landmark: initialValues.landmark ?? "",
      city: initialValues.city,
      state: initialValues.state,
      postalCode: initialValues.postalCode,
      country: initialValues.country,
      isDefault: initialValues.isDefault,
    });
  }, [initialValues, form]);

  function submit(values: AddressFormValues) {
    onSubmit(values);
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4 sm:space-y-5"
    >
      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-xs font-medium text-foreground">
          Full Name <span className="text-destructive">*</span>
        </Label>

        <Input
          id="fullName"
          placeholder="e.g. Eleanor Vance"
          aria-invalid={Boolean(errors.fullName)}
          {...register("fullName")}
          className="h-10 text-xs bg-secondary/30 border-input rounded-xl focus-visible:ring-1 focus-visible:ring-ring"
        />

        {errors.fullName && (
          <p className="text-[11px] font-medium text-destructive">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Phone Field Group */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4">
        <div className="col-span-4 sm:col-span-3 space-y-1.5">
          <Label htmlFor="phoneCode" className="text-xs font-medium text-foreground">
            Code <span className="text-destructive">*</span>
          </Label>

          <Controller
            control={control}
            name="phoneCode"
            render={({ field }) => (
              <PhoneCodeSelect
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {errors.phoneCode && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.phoneCode.message}
            </p>
          )}
        </div>

        <div className="col-span-8 sm:col-span-9 space-y-1.5">
          <Label htmlFor="phone" className="text-xs font-medium text-foreground">
            Phone Number <span className="text-destructive">*</span>
          </Label>

          <Input
            id="phone"
            type="tel"
            placeholder="9876543210"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
            className="h-10 text-xs bg-secondary/30 border-input rounded-xl focus-visible:ring-1 focus-visible:ring-ring"
          />

          {errors.phone && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Address Line 1 */}
      <div className="space-y-1.5">
        <Label htmlFor="addressLine1" className="text-xs font-medium text-foreground">
          Address Line 1 <span className="text-destructive">*</span>
        </Label>

        <Input
          id="addressLine1"
          placeholder="Flat, House no., Building, Company, Apartment"
          aria-invalid={Boolean(errors.addressLine1)}
          {...register("addressLine1")}
          className="h-10 text-xs bg-secondary/30 border-input rounded-xl focus-visible:ring-1 focus-visible:ring-ring"
        />

        {errors.addressLine1 && (
          <p className="text-[11px] font-medium text-destructive">
            {errors.addressLine1.message}
          </p>
        )}
      </div>

      {/* Address Line 2 */}
      <div className="space-y-1.5">
        <Label htmlFor="addressLine2" className="text-xs font-medium text-muted-foreground">
          Address Line 2 <span className="text-[10px] text-muted-foreground/70">(Optional)</span>
        </Label>

        <Input
          id="addressLine2"
          placeholder="Area, Street, Sector, Village"
          {...register("addressLine2")}
          className="h-10 text-xs bg-secondary/30 border-input rounded-xl focus-visible:ring-1 focus-visible:ring-ring"
        />

        {errors.addressLine2 && (
          <p className="text-[11px] font-medium text-destructive">
            {errors.addressLine2.message}
          </p>
        )}
      </div>

      {/* Landmark */}
      <div className="space-y-1.5">
        <Label htmlFor="landmark" className="text-xs font-medium text-muted-foreground">
          Landmark <span className="text-[10px] text-muted-foreground/70">(Optional)</span>
        </Label>

        <Input
          id="landmark"
          {...register("landmark")}
          placeholder="e.g. Near Metro Station"
          className="h-10 text-xs bg-secondary/30 border-input rounded-xl focus-visible:ring-1 focus-visible:ring-ring"
        />

        {errors.landmark && (
          <p className="text-[11px] font-medium text-destructive">
            {errors.landmark.message}
          </p>
        )}
      </div>

      {/* City & State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="state" className="text-xs font-medium text-foreground">
            State <span className="text-destructive">*</span>
          </Label>

          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <StateSelect
                country={watch("country")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {errors.state && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.state.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-xs font-medium text-foreground">
            City <span className="text-destructive">*</span>
          </Label>

          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <CitySelect
                country={watch("country")}
                state={watch("state")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {errors.city && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.city.message}
            </p>
          )}
        </div>
      </div>

      {/* PIN & Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="postalCode" className="text-xs font-medium text-foreground">
            PIN / Postal Code <span className="text-destructive">*</span>
          </Label>

          <Input
            id="postalCode"
            placeholder="6 digits [0-9]"
            aria-invalid={Boolean(errors.postalCode)}
            {...register("postalCode")}
            className="h-10 text-xs bg-secondary/30 border-input rounded-xl focus-visible:ring-1 focus-visible:ring-ring"
          />

          {errors.postalCode && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="country" className="text-xs font-medium text-foreground">
            Country <span className="text-destructive">*</span>
          </Label>

          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <CountrySelect
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {errors.country && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {/* Set Default Address Checkbox */}
      <div className="flex items-center gap-2.5 pt-2">
        <Controller
          control={control}
          name="isDefault"
          render={({ field }) => (
            <Checkbox
              id="isDefault"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              className="rounded-md cursor-pointer"
            />
          )}
        />

        <Label
          htmlFor="isDefault"
          className="text-xs font-medium text-foreground cursor-pointer select-none"
        >
          Set as default delivery address
        </Label>
      </div>

      {/* Form Submission Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-xs font-semibold tracking-wider uppercase rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Saving Address...</span>
          </span>
        ) : initialValues ? (
          "Update Address"
        ) : (
          "Save Address"
        )}
      </Button>
    </form>
  );
}