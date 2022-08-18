import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import commonMiddleware from '../../middlewares/common.middleware';
import { SchemaUserCreateByUser } from '@/constants/enumFormSchema';
import adminController from '@/controllers/admin';
import authMiddleware from '@middlewares/auth.middleware';
import clientController from '@/controllers/client';

class ProductRoute implements Routes {
  public path = '/client/product';
  public router = Router();
  public productController = new clientController.ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/get_detail_info`, this.productController.getProductDetailInfo);
  }
}

export default ProductRoute;
