export type MediaType = "IMAGE" | "VIDEO";

export interface ProductMedia {
  id: string;
  url: string;
  type: MediaType;
  altText: string | null;
  sortOrder: number;
}

export interface ProductMediaInput {
  url: string;
  type: MediaType;
  altText?: string;
  sortOrder?: number;
}

export interface Product {
  id: string;

  title: string;
  description: string | null;

  price: number;
  stock: number;

  sku: string;

  media: ProductMedia[];

  type: string;
  material: string;
  color: string;
  room: string;
  dimensions: string;

  createdAt: string | Date;
  updatedAt: string | Date;
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
  description: string;

  price: number;
  stock: number;

  sku: string;

  media: ProductMediaInput[];

  type: string;
  material: string;
  color: string;
  room: string;
  dimensions: string;
}

export interface ProductsArgs {
  filter?: {
    category?: string;
    room?: string;
    material?: string;
    color?: string;
    search?: string;
    excludeId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  };
  page?: number;
  limit?: number;
  related?: boolean;
}


export interface CreateProductInput {
  title: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  type: string;
  material: string;
  color: string;
  room: string;
  dimensions: string;
  media?: ProductMediaInput[];
}


export interface UpdateProductInput extends CreateProductInput { }

export interface CreateProductArgs {
  input: CreateProductInput;
}

export interface UpdateProductArgs {
  id: string;
  input: UpdateProductInput;
}