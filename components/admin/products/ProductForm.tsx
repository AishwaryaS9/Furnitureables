"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductFormData, ProductMediaInput } from "@/types/product";

interface ProductFormProps {
  initialValues?: ProductFormData;
  onSubmit: (values: ProductFormData) => Promise<void>;
  loading?: boolean;
}

const emptyValues: ProductFormData = {
  title: "",
  description: "",
  price: 0,
  stock: 0,
  media: [],
  type: "",
  material: "",
  color: "",
  room: "",
  dimensions: "",
  sku: "",
};

export default function ProductForm({
  initialValues = emptyValues,
  onSubmit,
  loading = false,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialValues);
  const [uploading, setUploading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);

    try {
      const uploadedMedia: ProductMediaInput[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = await res.json();

        uploadedMedia.push({
          url: data.url,
          type: "IMAGE",
          sortOrder: uploadedMedia.length,
        });
      }

      setForm((prev) => ({
        ...prev,
        media: [
          ...prev.media,
          ...uploadedMedia.map((media, index) => ({
            ...media,
            sortOrder: prev.media.length + index,
          })),
        ],
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveMedia(indexToRemove: number) {
    setForm((prev) => ({
      ...prev,
      media: prev.media
        .filter((_, index) => index !== indexToRemove)
        .map((media, index) => ({ ...media, sortOrder: index })),
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-xs"
    >
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold tracking-tight text-foreground border-b border-border/40 pb-2">
          Basic Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-xs font-semibold text-foreground">
              Product Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Ergonomic Wooden Chair"
              value={form.title}
              onChange={handleChange}
              required
              className="h-11 rounded-2xl border-border/60 bg-card/60"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="sku" className="text-xs font-semibold text-foreground">
              SKU Code <span className="text-destructive">*</span>
            </label>
            <Input
              id="sku"
              name="sku"
              placeholder="e.g., FUR-CH-001"
              value={form.sku}
              onChange={handleChange}
              required
              className="h-11 rounded-2xl border-border/60 bg-card/60 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="price" className="text-xs font-semibold text-foreground">
              Price (₹) <span className="text-destructive">*</span>
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              placeholder="0.00"
              value={form.price || ""}
              onChange={handleChange}
              required
              className="h-11 rounded-2xl border-border/60 bg-card/60"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="stock" className="text-xs font-semibold text-foreground">
              Stock Quantity <span className="text-destructive">*</span>
            </label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              placeholder="0"
              value={form.stock || ""}
              onChange={handleChange}
              required
              className="h-11 rounded-2xl border-border/60 bg-card/60"
            />
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold tracking-tight text-foreground border-b border-border/40 pb-2">
          Product Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="type" className="text-xs font-semibold text-foreground">
              Type / Category <span className="text-destructive">*</span>
            </label>
            <Input
              id="type"
              name="type"
              placeholder="e.g., Chair, Sofa, Table"
              value={form.type}
              onChange={handleChange}
              required
              className="h-11 rounded-2xl border-border/60 bg-card/60"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="material" className="text-xs font-semibold text-foreground">
              Material <span className="text-destructive">*</span>
            </label>
            <Input
              id="material"
              name="material"
              placeholder="e.g., Oak Wood, Leather"
              value={form.material}
              onChange={handleChange}
              required
              className="h-11 rounded-2xl border-border/60 bg-card/60"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="color" className="text-xs font-semibold text-foreground">
              Color <span className="text-destructive">*</span>
            </label>
            <Input
              id="color"
              name="color"
              placeholder="e.g., Walnut Brown"
              value={form.color}
              onChange={handleChange}
              required
              className="h-11 rounded-2xl border-border/60 bg-card/60"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="room" className="text-xs font-semibold text-foreground">
              Target Room <span className="text-destructive">*</span>
            </label>
            <Input
              id="room"
              name="room"
              placeholder="e.g., Living Room, Office"
              value={form.room}
              onChange={handleChange}
              required
              className="h-11 rounded-2xl border-border/60 bg-card/60"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
            <label htmlFor="dimensions" className="text-xs font-semibold text-foreground">
              Dimensions <span className="text-destructive">*</span>
            </label>
            <Input
              id="dimensions"
              name="dimensions"
              placeholder="e.g., 45cm x 50cm x 90cm"
              value={form.dimensions}
              onChange={handleChange}
              required
              className="h-11 rounded-2xl border-border/60 bg-card/60"
            />
          </div>
        </div>
      </div>

      {/* Media Upload Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold tracking-tight text-foreground border-b border-border/40 pb-2">
          Product Gallery
        </h2>

        <div className="space-y-3">
          <label
            htmlFor="media-file-upload"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border/80 rounded-2xl cursor-pointer bg-card/30 hover:bg-muted/40 transition-colors group"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" aria-hidden="true" />
              <p className="text-xs font-semibold text-foreground">
                Click or drag files here to upload images
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                PNG, JPG, WEBP up to 5MB each
              </p>
            </div>
            <input
              id="media-file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>

          {uploading && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
              <span>Uploading media assets...</span>
            </div>
          )}

          {form.media.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {form.media.map((media, index) => (
                <div
                  key={index}
                  className="group relative h-24 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-xs"
                >
                  <Image
                    src={media.url}
                    alt={`Product image preview ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg opacity-90 transition-opacity hover:opacity-100 shadow-xs"
                    aria-label={`Remove preview image ${index + 1}`}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-xs font-semibold text-foreground">
          Detailed Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          placeholder="Write a clear summary covering key design details, comfort features, and care instructions..."
          className="w-full rounded-2xl border border-border/60 bg-card/60 p-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        />
      </div>

      {/* Submit Controls */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={loading || uploading}
          className="h-11 px-8 rounded-2xl font-semibold gap-2 shadow-sm shadow-primary/20 hover:shadow-md transition-all w-full sm:w-auto"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Uploading Media...</span>
            </>
          ) : loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Saving Product...</span>
            </>
          ) : (
            <span>Save Product</span>
          )}
        </Button>
      </div>
    </form>
  );
}