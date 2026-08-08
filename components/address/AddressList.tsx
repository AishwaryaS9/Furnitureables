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
import DeleteAddressDialog from "./DeleteAddressDialog";
import EmptyAddress from "./EmptyAddress";
import { toast } from "sonner";
import AddressCardSkeleton from "./AddressCardSkeleton";
import { cn } from "@/lib/utils";

export default function AddressList() {
  const { user } = useUser();

  const { data: addresses, isLoading } = useAddresses(user?.id);

  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address>();

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleAdd() {
    setEditingAddress(undefined);
    setDialogOpen(true);
  }

  function handleEdit(address: Address) {
    setEditingAddress(address);
    setDialogOpen(true);
  }

  function handleDeleteClick(id: string) {
    setDeleteId(id);
  }

  async function handleConfirmDelete() {
    if (!deleteId) return;

    try {
      await deleteAddress.mutateAsync(deleteId);
      toast.success("Address deleted successfully.");
    } catch {
      toast.error("Unable to delete address. Please try again.");
    } finally {
      setDeleteId(null);
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress.mutateAsync(id);
      toast.success("Default delivery address updated.");
    } catch {
      toast.error("Unable to set default address.");
    }
  }

  if (isLoading) {
    return (
      <section
        aria-label="Loading saved delivery addresses"
        aria-busy="true"
        className="space-y-4"
      >
        <div className="flex items-center justify-between pb-2">
          <div className="h-6 w-36 bg-secondary/80 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-secondary/80 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AddressCardSkeleton />
          <AddressCardSkeleton />
          <AddressCardSkeleton />
        </div>
      </section>
    );
  }

  const addressCount = addresses?.length ?? 0;

  return (
    <section aria-labelledby="address-list-heading" className="space-y-6">
      {/* Section Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2
            id="address-list-heading"
            className="text-lg sm:text-xl font-serif font-normal tracking-tight text-foreground"
          >
            Saved Locations
          </h2>
          {addressCount > 0 && (
            <span className="text-[11px] font-mono font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border/50 shrink-0">
              {addressCount} {addressCount === 1 ? "Location" : "Locations"}
            </span>
          )}
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          className={cn(
            "h-10 px-4 text-xs font-semibold tracking-wide uppercase rounded-xl transition-all shadow-xs cursor-pointer w-fit shrink-0 self-start sm:self-auto",
            "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>Add Address</span>
        </Button>
      </div>

      {/* Empty State vs 3-Column Card Grid Feed */}
      {!addresses?.length ? (
        <EmptyAddress onAdd={handleAdd} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDeleteClick(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal Dialog */}
      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
      />

      {/* Delete Confirmation Modal Dialog */}
      <DeleteAddressDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteAddress.isPending}
      />
    </section>
  );
}