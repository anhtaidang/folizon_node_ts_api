import { Request } from 'express';
import { UserDTO } from '@interfaces/users.interface';

export interface DataStoredInToken {
  uid: number;
  username: string;
  email: string;
}

export interface TokenData {
  accessToken: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UserDTO;
}
