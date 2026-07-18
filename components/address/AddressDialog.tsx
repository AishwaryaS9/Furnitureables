"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

import AddressForm from "./AddressForm";

import { Address, AddressInput } from "@/types/address";

import { useCreateAddress } from "@/hooks/useCreateAddress";
import { useUpdateAddress } from "@/hooks/useUpdateAddress";

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address;
}

export default function AddressDialog({
  open,
  onOpenChange,
  address,
}: AddressDialogProps) {
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();

  async function handleSubmit(values: AddressInput) {
    try {
      if (address) {
        await updateAddress.mutateAsync({
          id: address.id,
          input: values,
        });

        toast.success("Address updated successfully.");
      } else {
        await createAddress.mutateAsync(values);

        toast.success("Address added successfully.");
      }

      onOpenChange(false);
    } catch (err) {
      console.error(err);

      toast.error(
        address
          ? "Failed to update address."
          : "Failed to add address."
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {address ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <AddressForm
          initialValues={address}
          loading={
            createAddress.isPending ||
            updateAddress.isPending
          }
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}