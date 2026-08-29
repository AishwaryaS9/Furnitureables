"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit3, Trash2, PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import DeleteDialog from "@/components/admin/products/DeleteDialog";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { Product } from "@/types/product";
import { getProductThumbnail } from "@/lib/utils";

interface Props {
  products: Product[];
}

export default function ProductTable({ products }: Props) {
  const deleteProduct = useDeleteProduct();

  // Selected product state for deletion
  const [productToDelete, setProductToDelete] = useState<{ id: string; title: string } | null>(null);

  async function handleConfirmDelete() {
    if (!productToDelete) return;
    await deleteProduct.mutateAsync(productToDelete.id);
    setProductToDelete(null);
  }

  const renderStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="rounded-xl px-2.5 py-1 text-xs font-medium">
          Out of stock
        </Badge>
      );
    }
    if (stock <= 5) {
      return (
        <Badge className="rounded-xl px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20">
          Low Stock ({stock})
        </Badge>
      );
    }
    return (
      <Badge className="rounded-xl px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
        In Stock ({stock})
      </Badge>
    );
  };

  return (
    <>
      <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table aria-label="Products Table">
            <TableHeader>
              <TableRow className="border-b border-border/60 bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-20 py-4 pl-6 font-semibold uppercase text-muted-foreground text-xs">Item</TableHead>
                <TableHead className="py-4 font-semibold uppercase text-left text-muted-foreground text-xs">Title</TableHead>
                <TableHead className="hidden sm:table-cell py-4 font-semibold uppercase text-muted-foreground text-xs">SKU</TableHead>
                <TableHead className="hidden md:table-cell py-4 font-semibold uppercase text-muted-foreground text-xs">Category</TableHead>
                <TableHead className="py-4 font-semibold uppercase text-muted-foreground text-xs">Price</TableHead>
                <TableHead className="py-4 font-semibold uppercase text-muted-foreground text-xs">Stock Status</TableHead>
                <TableHead className="py-4 pr-6 text-right font-semibold uppercase text-muted-foreground text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product: Product) => (
                <TableRow
                  key={product.id}
                  className="border-b border-border/40 transition-colors hover:bg-muted/30"
                >
                  {/* Thumbnail */}
                  <TableCell className="py-3.5 pl-6">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/30 shadow-xs">
                      <Image
                        src={getProductThumbnail(product)}
                        alt={product.title}
                        fill
                        priority
                        sizes="48px"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </TableCell>

                  {/* Title */}
                  <TableCell className="py-3.5 font-medium text-foreground">
                    <div className="line-clamp-1">{product.title}</div>
                    <div className="sm:hidden text-xs text-muted-foreground font-normal mt-0.5">
                      {product.sku} • {product.type}
                    </div>
                  </TableCell>

                  {/* SKU */}
                  <TableCell className="hidden sm:table-cell py-3.5 font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </TableCell>

                  {/* Category */}
                  <TableCell className="hidden md:table-cell py-3.5 text-xs font-medium text-muted-foreground capitalize">
                    {product.type}
                  </TableCell>

                  {/* Price */}
                  <TableCell className="py-3.5 font-medium text-foreground">
                    ₹{product.price.toLocaleString("en-IN")}
                  </TableCell>

                  {/* Stock Badge */}
                  <TableCell className="py-3.5">{renderStockBadge(product.stock)}</TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/admin/products/${product.id}/edit`} tabIndex={-1}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                          aria-label={`Edit ${product.title}`}
                        >
                          <Edit3 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </Link>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setProductToDelete({ id: product.id, title: product.title })}
                        disabled={deleteProduct.isPending}
                        className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                        aria-label={`Delete ${product.title}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-56 whitespace-normal text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <PackageSearch className="h-10 w-10 text-muted-foreground/40" />
                      <p className="text-sm font-semibold">No products match your filter.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Standalone Delete Confirmation Dialog */}
      <DeleteDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
        title={productToDelete?.title ?? null}
        onConfirm={handleConfirmDelete}
        loading={deleteProduct.isPending}
      />
    </>
  );
}