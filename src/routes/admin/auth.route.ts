import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import adminController from '@/controllers/admin';

class AuthRoute implements Routes {
  public path = '/admin/auth';
  public router = Router();
  public authController = new adminController.AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/prelogin`, this.authController.prelogin);
    this.router.post(`${this.path}/login`, this.authController.loginUser);
  }
}

export default AuthRoute;
