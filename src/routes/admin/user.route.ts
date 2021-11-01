import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import commonMiddleware from '../../middlewares/common.middleware';
import { SchemaUserCreateByUser } from '@/constants/enumFormSchema';
import adminController from '@/controllers/admin';
import authMiddleware from '@middlewares/auth.middleware';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public usersController = new adminController.UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers);
    // this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    this.router.post(`${this.path}/get_ids`, authMiddleware, this.usersController.getUserIds);
    this.router.post(`${this.path}/get_infos`, authMiddleware, this.usersController.getUserInfoByIds);
    this.router.post(`${this.path}/create_user`, commonMiddleware.verifyParseParam(SchemaUserCreateByUser), this.usersController.createUser);
    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
  }
}

export default UserRoute;
