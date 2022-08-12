export interface CreateUserReq {
  personalInfo: {
    firstName: string;
    lastName: string;
    fullname: string;
    phone: string;
    address: string;
    isActive: boolean;
  };
  basicInfo?: {
    avatar: string;
  };
  accountInfo: {
    email: string;
    username: string;
    password?: string;
  };
}
export interface UpdateUserReq {
  uid: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    fullname: string;
    phone: string;
    address: string;
    isActive: boolean;
  };
  basicInfo?: {
    avatar: string;
  };
  accountInfo: {
    email: string;
    username: string;
    password?: string;
  };
}

export interface GetUserIdsReq {
  uid: number;
  name: string;
}

export interface GetUserInfoByIdsReq {
  uids: number[];
}
