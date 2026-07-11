export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
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
