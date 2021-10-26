import { Router } from 'express';
import { CreateUserDto } from '../../dtos/users.dto';
import { Routes } from '../../interfaces/routes.interface';
import validationMiddleware from '../../middlewares/validation.middleware';
import commonMiddleware from '../../middlewares/common.middleware';
import { SchemaUserCreateByUser } from '@/constants/enumFormSchema';
import adminController from '@/controllers/admin';

class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new adminController.UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    this.router.post(`${this.path}/get_user`, this.usersController.getUser);
    this.router.post(`${this.path}/create_user`, commonMiddleware.verifyParseParam(SchemaUserCreateByUser), this.usersController.createUser);
    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
  }
}

export default UserRoute;
