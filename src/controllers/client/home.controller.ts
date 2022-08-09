import config from 'config';
import { EnumResult } from '@constants/enumCommon';
import { NextFunction, Response } from 'express';
import { sendApiResponseData, sendError } from '../utils';
import { RequestBodyType } from '@interfaces/common.interface';
import CategoryService from '@/services/category.service';
import ProductService from '@/services/product.service';
import HomeHelper from './helpers/home.helper';
import CommonHelper from './helpers/common.helper';
import { ProductDTO } from '@/interfaces/product.interface';
import c from 'config';
import { ProductItem } from './interfaces/common';

class HomeController {
  private categoryService = new CategoryService();
  private productService = new ProductService();
  private homeHelper = new HomeHelper();
  private commonHelper = new CommonHelper();

  public getHomeDataApp = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.findAll({
        where: { isActive: true, parentId: 0 },
        order: [
          ['updatedTime', 'DESC'],
          ['createdTime', 'DESC'],
        ],
      });

      let categoriesMap = categories.map(m => this.homeHelper.bindCategory<ProductItem>(m));

      categoriesMap = await Promise.all(
        categoriesMap.map(async m => {
          const products = await this.productService.findAll({
            where: { isActive: true, categoryId: m.id },
            limit: 10,
            order: [
              ['updatedTime', 'DESC'],
              ['createdTime', 'DESC'],
            ],
          });
          const childrenCategories = await this.categoryService.findAll({
            where: { isActive: true, parentId: m.id },
          });
          return {
            ...m,
            childrenCategories: childrenCategories.map(m => this.homeHelper.bindCategory<ProductItem>(m)),
            products: products.map(this.commonHelper.bindProductItem),
          };
        }),
      );

      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: { categories: categoriesMap },
      });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };
}

export default HomeController;
