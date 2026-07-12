export interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  sku: string;
  image?: string;
  material?: string;
  color?: string;
  type?: string;
  createdAt?: string;
};


export type ProductUploadInput = {
  title: string;
  description?: string | null;
  price: number;
  stock: number;
  image?: string | null;
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
  image?: string;
  type: string;
  material: string;
  color: string;
  room: string;
  dimensions: string;
  sku: string;
}