export type MediaType = "IMAGE" | "VIDEO";

export interface ProductMedia {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  altText?: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;

  image?: string; 

  media?: ProductMedia[];

  material?: string;
  color?: string;
  type?: string;
  room?: string;
  dimensions?: string;

  createdAt?: string;
  updatedAt?: string;
}

export type ProductUploadInput = {
  title: string;
  description?: string | null;

  price: number;
  stock: number;

  media?: {
    url: string;
    type: MediaType;
    altText?: string;
    sortOrder?: number;
  }[];

  type: string;
  material: string;
  color: string;
  room: string;
  dimensions: string;
  sku: string;
};

export interface ProductFormData {
  title: string;
  description?: string;

  price: number;
  stock: number;

  media: ProductMedia[];

  type: string;
  material: string;
  color: string;
  room: string;
  dimensions: string;
  sku: string;
}