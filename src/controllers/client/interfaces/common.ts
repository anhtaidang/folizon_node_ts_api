import { CategoryDTO } from '@/interfaces/category.interface';
import { type } from 'os';

export type CategoryMapProduct<C, T> = C & {
  products?: T[];
  childrenCategories?: any;
};

export type ProductItem = {
  id: number;
  title: string;
  urlDetail: string;
  urlRewrite: string;
  price: number;
  salePrice: number;
  retailPrice: number;
  discount: number;
  likeCount: number;
  viewCount: number;
  isSaleOff: boolean;
  isFreeDelivery: boolean;
  isBestSeller: boolean;
  categoryId: number;
  categoryRewrite: string;
  categoryName: string;
  imageThumb: string;
};
