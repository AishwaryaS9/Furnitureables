"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { Product } from "@/types/product";
import { getProductThumbnail } from "@/lib/utils";
import Image from "next/image";

interface Props {
  products: Product[];
}

export default function ProductTable({
  products,
}: Props) {
  const deleteProduct = useDeleteProduct();

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this product?"
    );

    if (!confirmed) return;

    await deleteProduct.mutateAsync(id);
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">SKU</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product: Product) => (
            <tr
              key={product.id}
              className="border-t"
            >
              <td className="p-4">
                <div className="relative h-16 w-16">
                  <Image
                    src={getProductThumbnail(product)}
                    alt={product.title}
                    fill
                    sizes="64px"
                    className="rounded object-cover"
                  />
                </div>
              </td>

              <td className="p-4">
                {product.title}
              </td>

              <td className="p-4">
                {product.sku}
              </td>

              <td className="p-4">
                {product.type}
              </td>

              <td className="p-4">
                ₹{product.price}
              </td>

              <td className="p-4">
                {product.stock}
              </td>

              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                  >
                    <Button variant="outline">
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleDelete(product.id)
                    }
                    disabled={
                      deleteProduct.isPending
                    }
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-gray-500"
              >
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

