import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import adminController from '@/controllers/admin';
import authMiddleware from '@/middlewares/auth.middleware';

class CategoryRoute implements Routes {
  public path = '/admin/category';
  public router = Router();
  public categoryController = new adminController.CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/get_ids`, this.categoryController.getCategoryIds);
    this.router.post(`${this.path}/get_infos`, this.categoryController.getCategoryInfos);
    this.router.post(`${this.path}/get_tree`, this.categoryController.getCategoryTree);
    this.router.post(`${this.path}/create`, authMiddleware, this.categoryController.createCategory);
    this.router.post(`${this.path}/update`, authMiddleware, this.categoryController.updateCategory);
    this.router.post(`${this.path}/delete_by_ids`, authMiddleware, this.categoryController.deleteCategoryByIds);
  }
}

export default CategoryRoute;
