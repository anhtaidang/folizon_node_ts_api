import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ShopController from '@/controllers/admin/shop.controller';
import adminController from '@/controllers/admin';

class ShopRoute implements Routes {
  public path = '/admin/shop';
  public router = Router();
  public shopController = new adminController.ShopController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/get_ids`, this.shopController.getShopIds);
    this.router.post(`${this.path}/get_infos`, this.shopController.getShopInfoByIds);
    this.router.post(`${this.path}/get_by_keyword`, this.shopController.getShopInfoByKeyWord);
    this.router.post(`${this.path}/create`, this.shopController.createShop);
    this.router.post(`${this.path}/update`, this.shopController.updateShop);
    this.router.post(`${this.path}/delete_by_ids`, this.shopController.deleteShopByIds);
  }
}

export default ShopRoute;
