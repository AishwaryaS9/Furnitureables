"use client";

import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { ProductFormData } from "@/types/product";
import ProductForm from "@/components/admin/products/ProductForm";

export default function CreateProductPage() {
    const router = useRouter();

    const createProduct = useCreateProduct();

    async function handleSubmit(data: ProductFormData) {
        await createProduct.mutateAsync(data);

        router.push("/admin/products");
    }

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-6">
            <h1 className="text-3xl font-bold">
                Create Product
            </h1>

            <ProductForm
                onSubmit={handleSubmit}
                loading={createProduct.isPending}
            />
        </div>
    );
}