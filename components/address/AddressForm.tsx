"use client";

import { useEffect, useState } from "react";
import { Address, AddressInput } from "@/types/address";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressFormProps {
  initialValues?: Address;

  loading?: boolean;

  onSubmit: (values: AddressInput) => void;
}

const initialForm: AddressInput = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export default function AddressForm({
  initialValues,
  loading = false,
  onSubmit,
}: AddressFormProps) {
  const [form, setForm] =
    useState<AddressInput>(initialForm);

  useEffect(() => {
    if (!initialValues) {
      setForm(initialForm);
      return;
    }

    setForm({
      fullName: initialValues.fullName,
      phone: initialValues.phone,
      addressLine1: initialValues.addressLine1,
      addressLine2:
        initialValues.addressLine2 ?? "",
      landmark:
        initialValues.landmark ?? "",
      city: initialValues.city,
      state: initialValues.state,
      postalCode: initialValues.postalCode,
      country: initialValues.country,
      isDefault: initialValues.isDefault,
    });
  }, [initialValues]);

  function update<K extends keyof AddressInput>(
    key: K,
    value: AddressInput[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    onSubmit({
      ...form,
      addressLine2:
        form.addressLine2?.trim() || undefined,
      landmark:
        form.landmark?.trim() || undefined,
    });

  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid gap-2">
        <Label htmlFor="fullName">
          Full Name
        </Label>

        <Input
          id="fullName"
          value={form.fullName}
          onChange={(e) =>
            update(
              "fullName",
              e.target.value
            )
          }
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="grid gap-2">
          <Label htmlFor="phone">
            Phone Number
          </Label>

          <Input
            id="phone"
            value={form.phone}
            onChange={(e) =>
              update(
                "phone",
                e.target.value
              )
            }
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="postalCode">
            Postal Code
          </Label>

          <Input
            id="postalCode"
            value={form.postalCode}
            onChange={(e) =>
              update(
                "postalCode",
                e.target.value
              )
            }
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addressLine1">
          Address Line 1
        </Label>

        <Input
          id="addressLine1"
          value={form.addressLine1}
          onChange={(e) =>
            update(
              "addressLine1",
              e.target.value
            )
          }
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addressLine2">
          Address Line 2
        </Label>

        <Input
          id="addressLine2"
          value={form.addressLine2}
          onChange={(e) =>
            update(
              "addressLine2",
              e.target.value
            )
          }
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="landmark">
          Landmark
        </Label>

        <Input
          id="landmark"
          value={form.landmark}
          onChange={(e) =>
            update(
              "landmark",
              e.target.value
            )
          }
          placeholder="Near Metro Station"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="grid gap-2">
          <Label htmlFor="city">
            City
          </Label>

          <Input
            id="city"
            value={form.city}
            onChange={(e) =>
              update(
                "city",
                e.target.value
              )
            }
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="state">
            State
          </Label>

          <Input
            id="state"
            value={form.state}
            onChange={(e) =>
              update(
                "state",
                e.target.value
              )
            }
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="country">
          Country
        </Label>

        <Input
          id="country"
          value={form.country}
          onChange={(e) =>
            update(
              "country",
              e.target.value
            )
          }
          required
        />
      </div>

      <div className="flex items-center space-x-3">
        <Checkbox
          id="default"
          checked={form.isDefault}
          onCheckedChange={(checked) =>
            update(
              "isDefault",
              checked === true
            )
          }
        />

        <Label
          htmlFor="default"
          className="cursor-pointer"
        >
          Set as default address
        </Label>
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