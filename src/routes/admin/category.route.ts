import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import adminController from '@/controllers/admin';

class CategoryRoute implements Routes {
  public path = '/admin/category';
  public router = Router();
  public categoryController = new adminController.CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get_tree`, this.categoryController.getCategoryTree);
  }
}

export default CategoryRoute;
