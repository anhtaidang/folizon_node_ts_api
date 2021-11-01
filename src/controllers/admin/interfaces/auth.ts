export interface AuthPreLoginReq {
  username: string;
}

export interface AuthLoginReq {
  username: string;
  passwordHash: string;
}
