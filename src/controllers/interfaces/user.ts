export interface CreateUserController {
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
