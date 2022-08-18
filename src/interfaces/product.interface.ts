import { CategoryDTO } from './category.interface';
import { ShopDTO } from './shop.interface';
import { UserDTO } from './users.interface';

export interface ProductDTO {
  id: number;
  categoryId: number;
  shopId: number;
  title: string;
  urlRewrite: string;
  content: string;
  description: string;
  imageThumb: string;
  retailPrice: number;
  salePrice: number;
  isActive: boolean;
  hashTags: string;
  isFreeDelivery: boolean;
  availibilityStatusType: number;
  statusType: number;
  isBestSeller: boolean;
  viewCount: number;
  likeCount: number;
  extraData: string;
  createdBy: number;
  createdTime: number;
  updatedBy: number;
  updatedTime: number;
  categoryMap?: CategoryDTO;
  shopMap?: ShopDTO;
  userCreated?: UserDTO;
  userUpdated?: UserDTO;
}

export type CreateProductDTO = Omit<ProductDTO, 'id' | 'createdBy' | 'createdTime'>;
export type UpdateProductDTO = Omit<ProductDTO, 'updatedBy' | 'updatedTime'>;
