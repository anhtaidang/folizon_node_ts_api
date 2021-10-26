export interface User {
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
}

export type CreateUserDTO = Omit<User, 'uid' | 'updatedBy' | 'updatedTime'>;
