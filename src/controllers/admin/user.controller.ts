import { NextFunction, Request, Response } from 'express';
import UserService from '@services/user.service';
import { DBOp } from '@databases';
import { isEmpty } from 'class-validator';
import { EnumResult } from '@/constants/enumCommon';
import { cryptPassword, getFileNameFromUrl } from '@/utils/util';
import { sendApiResponseData, sendError } from '../utils';
import { CreateUserReq, GetUserIdsReq, GetUserInfoByIdsReq, UpdateUserReq } from './interfaces/user';
import { RequestBodyType } from '@interfaces/common.interface';
import UserHelper from './helpers/user.helper';
import moment from 'moment';
import AuthController from './auth.controller';

class UserController {
  public userService = new UserService();
  public authController = new AuthController();
  public userHelper = new UserHelper();
  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData = await this.userService.findAll();
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: findAllUsersData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserIds = async (req: RequestBodyType<GetUserIdsReq>, res: Response, next: NextFunction) => {
    try {
      let requestSearch = null;
      const { uid, name } = req.body;
      if (!isEmpty(uid)) {
        requestSearch = { ...requestSearch, uid };
      }
      if (!isEmpty(name)) {
        requestSearch = { ...requestSearch, fullname: { [DBOp.like]: `%${name}%` } };
      }
      const uids = await this.userService.findAll({
        where: requestSearch,
        order: [['createdTime', 'DESC']],
        attributes: ['uid'],
      });
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: { uids: uids.map(m => m.uid) },
      });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };

  public getUserInfoByIds = async (req: RequestBodyType<GetUserInfoByIdsReq>, res: Response, next: NextFunction) => {
    try {
      const { uids } = req.body;
      const userInfos = await this.userService.findAll({ where: { uid: { [DBOp.in]: uids } } });
      const uinfos = userInfos.map(this.userHelper.bindDataUserInfos);
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: { uinfos },
      });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };

  public createUserByUser = async (req: RequestBodyType<CreateUserReq>, res: Response, next: NextFunction) => {
    try {
      const { basicInfo, accountInfo, personalInfo } = req.body;

      let codeResult = EnumResult.FAILD;
      let resonseData = null;
      const userLogin = await this.authController.getCurrentUserLogin(req);
      if (userLogin) {
        const { uid } = userLogin;
        const { salt, hash } = cryptPassword(accountInfo.password ?? '123456');
        resonseData = await this.userService.create({
          avatar: getFileNameFromUrl(basicInfo.avatar),
          username: accountInfo.username,
          email: accountInfo.email,
          password: hash,
          phone: personalInfo.phone,
          address: personalInfo.address,
          isActive: true,
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          fullname: personalInfo.fullname,
          salt: salt,
          createdBy: uid,
          createdTime: moment().unix(),
        });
        codeResult = EnumResult.SUCCESS;
      }
      return sendApiResponseData(res, codeResult, { data: resonseData });
    } catch (error) {
      sendError(res, next)(error);
      throw error;
    }
  };

  public updateUserByUser = async (req: RequestBodyType<UpdateUserReq>, res: Response, next: NextFunction) => {
    try {
      let codeResult = EnumResult.FAILD;
      let responseData: any = null;
      const userLogin = await this.authController.getCurrentUserLogin(req);
      if (userLogin) {
        let detail: any = {};
        const { accountInfo, personalInfo, basicInfo, uid } = req.body;
        if (accountInfo) {
          detail = {
            ...detail,
            ...accountInfo,
          };
        }
        if (personalInfo) {
          detail = {
            ...detail,
            ...personalInfo,
          };
        }
        if (basicInfo) {
          detail = {
            ...detail,
            avatar: getFileNameFromUrl(basicInfo.avatar),
          };
        }
        const { uid: currentUid } = userLogin;
        responseData = await this.userService.update(
          {
            ...detail,
            updatedBy: currentUid,
            updatedTime: moment().unix(),
          },
          { where: { uid } },
        );
        codeResult = EnumResult.SUCCESS;
      }
      return sendApiResponseData(res, codeResult, { data: responseData });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };

  // public getUserById = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userId = Number(req.params.id);
  //
  //     if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
  //     const findOneUserData: User = await this.userService.findById(userId);
  //
  //     if (!findOneUserData) throw new HttpException(409, "You're not user");
  //
  //     return sendApiResponseData(res, EnumResult.SUCCESS, { data: findOneUserData });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public updateUser = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userId = Number(req.params.id);
  //     const userData: CreateUserDto = req.body;
  //     const updateUserData: User = await this.userService.updateUser(userId, userData);
  //
  //     res.status(200).json({ data: updateUserData, message: 'updated' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  //
  // public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userId = Number(req.params.id);
  //     const deleteUserData: User = await this.userService.deleteUser(userId);
  //
  //     res.status(200).json({ data: deleteUserData, message: 'deleted' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default UserController;
