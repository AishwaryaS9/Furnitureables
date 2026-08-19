"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

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

  /* Skeleton Loading State */
  if (isLoading) {
    return (
      <div
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-10"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="sr-only">Loading product details for editing...</span>
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-150 w-full rounded-3xl" />
      </div>
    );
  }

  /* Error / Not Found State */
  if (!product) {
    return (
      <main
        id="main-content"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-10"
        role="main"
        aria-labelledby="not-found-title"
      >
        <nav aria-label="Breadcrumb">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 gap-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => router.push("/admin/products")}
            aria-label="Return to products catalog list"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Products</span>
          </Button>
        </nav>

        <Card className="rounded-3xl border-border/60 bg-card/60 backdrop-blur-xl shadow-xs">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
              aria-hidden="true"
            >
              <AlertCircle className="h-6 w-6" />
            </div>
            <h1 id="not-found-title" className="text-lg font-bold text-foreground">
              Product Not Found
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              The product you are trying to edit does not exist or may have been removed.
            </p>
            <div className="pt-2">
              <Link href="/admin/products" tabIndex={-1}>
                <Button
                  type="button"
                  className="rounded-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Return to the product catalog list page"
                >
                  Return to Catalog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
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
    <main
      id="main-content"
      className="space-y-6 sm:space-y-8 max-w-7xl mx-auto"
      role="main"
      aria-labelledby="page-title"
    >
      {/* Breadcrumb Navigation Landmark */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground">
        <ol className="flex items-center space-x-2">
          <li>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground -ml-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => router.push("/admin/products")}
              aria-label="Navigate back to products catalog"
            >
              <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
              <span>Products</span>
            </Button>
          </li>
          <li aria-hidden="true" className="select-none">/</li>
          <li>
            <span
              className="text-foreground font-medium"
              aria-current="page"
              aria-label={`Editing product ${product.title}`}
            >
              Edit
            </span>
          </li>
        </ol>
      </nav>

      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div className="space-y-2 min-w-0">
          <h1
            id="page-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground truncate gap-2.5 py-1"
          >
            Edit Product
          </h1>
          <p
            id="page-description"
            className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed"
          >
            Updating details for <span className="text-foreground font-semibold">"{product.title}"</span> ({product.sku}).
          </p>
        </div>
      </header>

      {/* Main Form Section Landmark */}
      <section aria-label={`Form to edit details for ${product.title}`}>
        <ProductForm
          mode="edit"
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={updateProduct.isPending}
        />
      </section>
    </main>
  );
}