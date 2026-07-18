"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Address, AddressInput } from "@/types/address";
import {
  addressSchema,
  AddressFormValues,
} from "@/lib/validations/address";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      className="space-y-5"
    >
      {/* Full Name */}

      <div className="space-y-2">
        <Label>Full Name</Label>

        <Input {...register("fullName")} />

        {errors.fullName && (
          <p className="text-sm text-red-500">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Phone */}

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Code</Label>

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
            <p className="text-sm text-red-500">
              {errors.phoneCode.message}
            </p>
          )}
        </div>

        <div className="col-span-3 space-y-2">
          <Label>Phone Number</Label>

          <Input {...register("phone")} />

          {errors.phone && (
            <p className="text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Address */}

      <div className="space-y-2">
        <Label>Address Line 1</Label>

        <Input {...register("addressLine1")} />

        {errors.addressLine1 && (
          <p className="text-sm text-red-500">
            {errors.addressLine1.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Address Line 2</Label>

        <Input {...register("addressLine2")} />

        {errors.addressLine2 && (
          <p className="text-sm text-red-500">
            {errors.addressLine2.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Landmark</Label>

        <Input
          {...register("landmark")}
          placeholder="Near Metro Station"
        />

        {errors.landmark && (
          <p className="text-sm text-red-500">
            {errors.landmark.message}
          </p>
        )}
      </div>

      {/* City & State */}

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>State</Label>

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
            <p className="text-sm text-red-500">
              {errors.state.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>City</Label>

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
            <p className="text-sm text-red-500">
              {errors.city.message}
            </p>
          )}
        </div>
      </div>

      {/* PIN & Country */}

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>PIN Code</Label>

          <Input {...register("postalCode")} />

          {errors.postalCode && (
            <p className="text-sm text-red-500">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Country</Label>

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
            <p className="text-sm text-red-500">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {/* Default */}

      <div className="flex items-center gap-3">
        <Controller
          control={control}
          name="isDefault"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) =>
                field.onChange(checked === true)
              }
            />
          )}
        />

        <Label>Set as default address</Label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Saving..."
          : initialValues
            ? "Update Address"
            : "Save Address"}
      </Button>
    </form>
  );
}