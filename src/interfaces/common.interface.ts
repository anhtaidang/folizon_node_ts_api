import { Request } from 'express';

export interface RequestBodyType<T> extends Request {
  body: T;
  saveCache?: (value: any) => void;
}
