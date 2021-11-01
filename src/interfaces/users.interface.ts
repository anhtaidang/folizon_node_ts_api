type UserMap = Pick<UserDTO, 'uid' | 'username' | 'fullname'>;

export interface UserDTO {
  uid: number;
  email: string;
  username: string;
  password: string;
  avatar: string;
  salt: string;
  phone: string;
  address: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  fullname: string;
  extraData?: string;
  cityId?: number;
  districtId?: number;
  createdTime: number;
  createdBy: number;
  updatedTime: number;
  updatedBy: number;
  userCreated?: UserMap;
  userUpdated?: UserMap;
}

export type CreateUserDTO = Omit<UserDTO, 'uid' | 'updatedBy' | 'updatedTime'>;
export type UpdateUserDTO = Omit<UserDTO, 'createdBy' | 'createdTime'>;
