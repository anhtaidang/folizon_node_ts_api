import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import commonMiddleware from '../../middlewares/common.middleware';
import { SchemaUserCreateByUser } from '@/constants/enumFormSchema';
import adminController from '@/controllers/admin';
import authMiddleware from '@middlewares/auth.middleware';
import clientController from '@/controllers/client';

class HomeRoute implements Routes {
  public path = '/client/home';
  public router = Router();
  public homeController = new clientController.HomeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/get_data`, this.homeController.getHomeDataApp);
  }
}

export default HomeRoute;
