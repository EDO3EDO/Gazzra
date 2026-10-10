import { Timestamp } from 'firebase/firestore';


export interface cartData {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
  coverImage: string;
  images: string[];
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
  Restoc?: string;
}
