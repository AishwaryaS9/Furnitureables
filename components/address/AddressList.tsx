"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/address";
import { useAddresses } from "@/hooks/useAddresses";
import { useDeleteAddress } from "@/hooks/useDeleteAddress";
import { useSetDefaultAddress } from "@/hooks/useSetDefaultAddress";
import AddressCard from "./AddressCard";
import AddressDialog from "./AddressDialog";
import EmptyAddress from "./EmptyAddress";
import { toast } from "sonner";
import AddressCardSkeleton from "./AddressCardSkeleton";

export default function AddressList() {
  const { user } = useUser();

  const {
    data: addresses,
    isLoading,
  } = useAddresses(user?.id);

  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingAddress, setEditingAddress] =
    useState<Address>();

  function handleAdd() {
    setEditingAddress(undefined);
    setDialogOpen(true);
  }

  function handleEdit(address: Address) {
    setEditingAddress(address);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this address?"
    );

    if (!confirmed) return;
    try {
      await deleteAddress.mutateAsync(id);

      toast.success("Address deleted.");
    } catch {
      toast.error("Unable to delete address.");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress.mutateAsync(id);

      toast.success("Default address updated.");
    } catch {
      toast.error("Unable to update default address.");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <AddressCardSkeleton />
        <AddressCardSkeleton />
        <AddressCardSkeleton />
      </div>
    );

  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-semibold">
          Saved Addresses
        </h2>

        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>

      </div>

      {/* Empty State */}
      {!addresses?.length ? (
        <EmptyAddress
          onAdd={handleAdd}
        />
      ) : (
        <div className="space-y-5">

          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() =>
                handleEdit(address)
              }
              onDelete={() =>
                handleDelete(address.id)
              }
              onSetDefault={() =>
                handleSetDefault(address.id)
              }
            />
          ))}

        </div>
      )}

      {/* Add / Edit Dialog */}
      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
      />
    </>
  );
}