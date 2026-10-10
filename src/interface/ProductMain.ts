export interface ProductVariant {
  color: string;
  size: string;
  stock: number;
  images: string[];
}

export interface ProductMain {
  title: string;
  price: number;
  category: string;
  stock: number;
  quantity:number,
  id: string;
  Restoc: string;
  coverImage: string;
  images: string[];
  createdAt: number;
  variants?: ProductVariant[];
}
