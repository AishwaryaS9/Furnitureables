"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import AddressForm from "./AddressForm";
import { Address, AddressInput } from "@/types/address";
import { useCreateAddress } from "@/hooks/useCreateAddress";
import { useUpdateAddress } from "@/hooks/useUpdateAddress";

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address;
  onSuccess?: (address: Address) => void;
}

export default function AddressDialog({ open, onOpenChange, address, onSuccess }: AddressDialogProps) {
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();

  async function handleSubmit(values: AddressInput) {
    try {
      let savedAddress: Address;

      if (address) {
        savedAddress = await updateAddress.mutateAsync({
          id: address.id,
          input: values,
        });

        toast.success("Address updated successfully.");
      } else {
        savedAddress = await createAddress.mutateAsync(values);

        toast.success("Address added successfully.");
      }

      onSuccess?.(savedAddress);
      onOpenChange(false);
    } catch (err) {
      console.error(err);

      toast.error(
        address
          ? "Failed to update address. Please try again."
          : "Failed to add address. Please try again."
      );
    }
  }

  const isEditing = Boolean(address);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-border/80 bg-card text-card-foreground p-0 shadow-xl backdrop-blur-md flex flex-col"
        aria-describedby="address-dialog-description"
      >
        {/* Fixed Header */}
        <DialogHeader className="space-y-1.5 text-left border-b border-border/50 p-6 sm:p-8 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-secondary border border-border/60 flex items-center justify-center text-primary shrink-0">
              <MapPin className="w-4 h-4" aria-hidden="true" />
            </div>
            <DialogTitle className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-foreground">
              {isEditing ? "Edit Delivery Address" : "Add New Address"}
            </DialogTitle>
          </div>

          <DialogDescription
            id="address-dialog-description"
            className="text-xs text-muted-foreground font-light pl-10"
          >
            {isEditing
              ? "Update your existing destination details for order deliveries."
              : "Save a new delivery address for seamless order fulfillment."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 sm:p-8 pt-4 flex-1">
          <AddressForm
            initialValues={address}
            loading={createAddress.isPending || updateAddress.isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}