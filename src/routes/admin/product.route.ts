import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import adminController from '@/controllers/admin';
import authMiddleware from '@/middlewares/auth.middleware';

class ProductRoute implements Routes {
  public path = '/admin/product';
  public router = Router();
  public productController = new adminController.ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/get_ids`, this.productController.getProductIds);
    this.router.post(`${this.path}/get_infos`, this.productController.getProductInfos);
    this.router.post(`${this.path}/get_by_keyword`, this.productController.getProductInfoByKeyword);
    this.router.post(`${this.path}/create`, authMiddleware, this.productController.createProduct);
    this.router.post(`${this.path}/update`, authMiddleware, this.productController.updateProduct);
  }
}

export default ProductRoute;
