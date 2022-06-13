import { NextFunction, Response } from 'express';
import config from 'config';
import jwt from 'jsonwebtoken';
import DB from '@databases';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authKey: string = config.get('authKey');
    const authorization = req.cookies[authKey] || req.header(authKey) || null;
    if (authorization) {
      const secretKey: string = config.get('secretKey');
      const verificationResponse = jwt.verify(authorization, secretKey) as DataStoredInToken;
      const userId = verificationResponse.uid;
      const findUser = await DB.Users.findByPk(userId);

      if (findUser) {
        if (findUser.isActive) {
          req.user = findUser;
          next();
        } else {
          next(new HttpException(401, 'User is not active'));
        }
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    console.log(error)
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
