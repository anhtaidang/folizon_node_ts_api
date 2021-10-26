import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';
import UserService from '../../services/users.service';
import { isEmpty } from 'class-validator';
import { HttpException } from '@/exceptions/HttpException';
import { sendApiResponseData, sendError } from '../utils';
import { EnumResult } from '@/constants/enumCommon';
import { CreateUserController } from '../interfaces/user';
import { cryptPassword } from '@/utils/util';

class UserController {
  public userService = new UserService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAll();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.body;
      if (isEmpty(uid)) throw new HttpException(400, "You're not userId");
      const userData: User = await this.userService.findOne({ where: { uid } });
      if (!userData) throw new HttpException(409, "You're not user");
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);

      if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
      const findOneUserData: User = await this.userService.findById(userId);

      if (!findOneUserData) throw new HttpException(409, "You're not user");

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { basicInfo, accountInfo, personalInfo }: CreateUserController = req.body;

      let codeResult = EnumResult.FAILD;

      const { salt, hash } = cryptPassword(accountInfo.password ?? '123456');
      const createUserData: User = await this.userService.create({
        avatar: basicInfo.avatar,
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
        createdBy: 0,
        createdTime: 0,
      });
      codeResult = EnumResult.SUCCESS;
      return sendApiResponseData(res, codeResult, createUserData);
    } catch (error) {
      sendError(res, next)(error);
      throw error;
    }
  };

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
