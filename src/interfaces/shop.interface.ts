import { UserDTO } from './users.interface';

export interface ShopDTO {
  id: number;
  uid: number;
  name: string;
  urlRewrite: string;
  description: string;
  imageThumb: string;
  imageBanner: string;
  hashTags: string;
  isActive: boolean;
  extraData: string;
  createdBy: number;
  createdTime: number;
  updatedBy: number;
  updatedTime: number;
  userCreated?: UserDTO;
  userUpdated?: UserDTO;
  userOwn?: UserDTO;
}

export type CreateShopDTO = Omit<ShopDTO, 'id' | 'updatedBy' | 'updatedTime'>;
export type UpdateShopDTO = Omit<ShopDTO, 'createdBy' | 'createdTime'>;
