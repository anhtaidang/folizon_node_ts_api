import { UserDTO } from './users.interface';

export interface CategoryDTO {
  id: number;
  parentId: number;
  name: string;
  urlRewrite: string;
  description: string;
  imageThumb: string;
  imageBanner: string;
  hashTags: string;
  isActive: boolean;
  createdBy: number;
  createdTime: number;
  updatedBy: number;
  updatedTime: number;
  categoryMap?: CategoryDTO;
  userCreated?: UserDTO;
  userUpdated?: UserDTO;
}

export interface CategoryTreeDTO extends CategoryDTO {
  children?: CategoryTreeDTO[];
}

export type CreateCategoryDTO = Omit<CategoryDTO, 'id' | 'updatedBy' | 'updatedTime'>;
export type UpdateCategoryDTO = Omit<CategoryDTO, 'createdBy' | 'createdTime'>;
