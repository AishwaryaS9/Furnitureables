"use client";

import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { ProductFormData } from "@/types/product";
import ProductForm from "@/components/admin/products/ProductForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function CreateProductPage() {
    const router = useRouter();
    const createProduct = useCreateProduct();

    async function handleSubmit(data: ProductFormData) {
        await createProduct.mutateAsync(data);
        router.push("/admin/products");
    }

    return (
        <main
            id="main-content"
            className="space-y-6 sm:space-y-8 max-w-7xl mx-auto"
            role="main"
            aria-labelledby="page-title"
        >
            {/* Navigation header */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-foreground -ml-2 transition-colors"
                    onClick={() => router.push("/admin/products")}
                    aria-label="Back to products list"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                    Products
                </Button>
                <span aria-hidden="true">/</span>
                <span className="text-foreground font-medium" aria-current="page">Create</span>
            </nav>

            {/* Page Header section */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
                <div className="space-y-2 min-w-0">
                    <h1
                        id="page-title"
                        className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground truncate gap-2.5 py-1"
                    >
                        Create New Product
                    </h1>
                    <p
                        id="page-description"
                        className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed"
                    >
                        Add a new product to your inventory catalog, configure its variants, pricing, and availability.
                    </p>
                </div>
            </header>

            {/* Form Section wrapped in an accessible container card */}
            <section aria-label="Product creation form">
                <ProductForm
                    onSubmit={handleSubmit}
                    loading={createProduct.isPending}
                />
            </section>
        </main>
    );
}