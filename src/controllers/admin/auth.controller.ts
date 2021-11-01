import config from 'config';
import { EnumResult } from '@constants/enumCommon';
import { NextFunction, Response } from 'express';
import UserService from '@services/user.service';
import { sendApiResponseData, sendError } from '../utils';
import { AuthLoginReq, AuthPreLoginReq } from './interfaces/auth';
import { UserDTO } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { RequestBodyType } from '@interfaces/common.interface';

class AuthController {
  private userService = new UserService();
  private authService = new AuthService();
  private secretKey: string = config.get('secretKey');
  private authKey: string = config.get('authKey');

  public prelogin = async (req: RequestBodyType<AuthPreLoginReq>, res: Response, next: NextFunction) => {
    try {
      // console.log('dbConfig:', config.get('dbConfig'));
      const { username } = req.body;
      let codeResult = EnumResult.ERROR_ACCOUNT_INVALID;
      let responseData = null;
      const user: UserDTO = await this.userService.getUserInfoByUsername(username, { attributes: ['salt'] });
      if (user) {
        const { salt } = user;
        codeResult = EnumResult.SUCCESS;
        responseData = {
          salt,
          verifyCode: this.secretKey,
        };
      } else {
        responseData = {
          errorMessage: 'Tài khoản không tồn tại!',
        };
      }
      return sendApiResponseData(res, codeResult, { data: responseData });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };

  public loginUser = async (req: RequestBodyType<AuthLoginReq>, res: Response, next: NextFunction) => {
    try {
      const { username, passwordHash } = req.body;
      let codeResult = EnumResult.ERROR_AUTHOR;
      let responseData = null;

      const { user, cookie, tokenData, errorMessage } = await this.authService.login(passwordHash, { where: { username } });
      if (user && cookie && tokenData) {
        responseData = {
          accessToken: tokenData.accessToken,
          uid: user.uid,
          username: user.username,
          fullname: user.fullname,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        res.setHeader('Set-Cookie', [cookie]);
        codeResult = EnumResult.SUCCESS;
      } else {
        responseData = {
          errorMessage,
        };
      }
      return sendApiResponseData(res, codeResult, { data: responseData });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: UserDTO = req.user;
      const logOutUserData: UserDTO = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', [`${this.authKey}=; Max-age=0`]);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
      return sendApiResponseData(res, EnumResult.SUCCESS, { data: logOutUserData });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
