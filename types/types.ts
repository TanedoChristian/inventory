export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  code?: string;
}

export interface ProductForm {
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  code?: string;
}
