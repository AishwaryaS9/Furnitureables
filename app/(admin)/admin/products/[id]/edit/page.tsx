"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import { ProductFormData } from "@/types/product";
import ProductForm from "@/components/admin/products/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data: product, isLoading } = useProduct(id);


  const updateProduct = useUpdateProduct();

  async function handleSubmit(values: ProductFormData) {
    await updateProduct.mutateAsync({
      id,
      input: values,
    });

    router.push("/admin/products");
  }

  if (isLoading) {
    return <p className="p-10">Loading...</p>;
  }

  if (!product) {
    return <p className="p-10">Product not found.</p>;
  }

  const initialValues: ProductFormData = {
    title: product.title,
    description: product.description ?? "",
    price: product.price,
    stock: product.stock,
    sku: product.sku,
    type: product.type,
    material: product.material,
    color: product.color,
    room: product.room,
    dimensions: product.dimensions,
    media: product.media.map((media) => ({
      url: media.url,
      type: media.type,
      sortOrder: media.sortOrder,
    })),
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Edit Product
      </h1>

      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={updateProduct.isPending}
      />
    </div>
  );
}