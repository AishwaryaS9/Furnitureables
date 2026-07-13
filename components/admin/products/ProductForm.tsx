"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductFormData } from "@/types/product";

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
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
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

      setForm((prev: any) => ({
        ...prev,
        media: [
          {
            url: data.url,
            type: "IMAGE",
            sortOrder: 0,
          },
        ],
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border bg-white p-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <Input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          required
        />

        <Input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <Input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <Input
          name="type"
          placeholder="Type"
          value={form.type}
          onChange={handleChange}
          required
        />

        <Input
          name="material"
          placeholder="Material"
          value={form.material}
          onChange={handleChange}
          required
        />

        <Input
          name="color"
          placeholder="Color"
          value={form.color}
          onChange={handleChange}
          required
        />

        <Input
          name="room"
          placeholder="Room"
          value={form.room}
          onChange={handleChange}
          required
        />

        <Input
          name="dimensions"
          placeholder="Dimensions"
          value={form.dimensions}
          onChange={handleChange}
          required
        />

        <div className="col-span-2 space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />

          {uploading && (
            <p className="text-sm text-muted-foreground">
              Uploading...
            </p>
          )}

          {form.media[0]?.url && (
            <img
              src={form.media[0].url}
              alt="Preview"
              className="h-28 w-28 rounded-lg border object-cover"
            />
          )}
        </div>
      </div>

      <textarea
        name="description"
        rows={5}
        value={form.description}
        onChange={handleChange}
        placeholder="Description..."
        className="w-full rounded-md border p-3"
      />

      <Button
        type="submit"
        disabled={loading || uploading}
      >
        {uploading ? "Uploading..." : loading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}