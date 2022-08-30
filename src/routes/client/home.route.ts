import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
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
