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
      data: values,
    });

    router.push("/admin/products");
  }

  if (isLoading) {
    return <p className="p-10">Loading...</p>;
  }

  if (!product) {
    return <p className="p-10">Product not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Edit Product
      </h1>

      <ProductForm
        initialValues={product}
        onSubmit={handleSubmit}
        loading={updateProduct.isPending}
      />
    </div>
  );
}