import config from 'config';
import { EnumResult } from '@constants/enumCommon';
import { NextFunction, Response } from 'express';
import { sendApiResponseData, sendError } from '../utils';
import { RequestBodyType } from '@interfaces/common.interface';
import { CategoryGetTreeReq } from './interfaces/category';
import { genUrlMediaByFolderType, removeParamRequest } from '@/utils/util';
import { EnumFolderType } from '@/constants/enum';
import CategoryService from '@/services/category.service';
import CategoryHelper from './helpers/category.helper';
import { CategoryTreeDTO } from '@/interfaces/category.interface';

class CategoryController {
  private categoryService = new CategoryService();
  private categoryHelper = new CategoryHelper();
  public getCategoryTree = async (req: RequestBodyType<CategoryGetTreeReq>, res: Response, next: NextFunction) => {
    try {
      const { parentId = 0, id = null } = req.body;
      let categoryInfos: CategoryTreeDTO[] | any = await this.categoryService.findAll({ where: removeParamRequest({ parentId, id }) });
      // console.log(await this.categoryService.getCombineTreeNodeCategory(categoryInfos[3]));
      for (let el of categoryInfos) {
        el = await this.categoryService.getCombineTreeNodeCategory(el);
      }
      // console.log(categoryInfos.map(this.categoryService.getCombineTreeNodeCategory));
      // categoryInfos = await Promise.all(categoryInfos.map(this.categoryService.getCombineTreeNodeCategory));
      categoryInfos = categoryInfos.map(m => this.categoryHelper.bindDataTreeNodeCategory(m, this.categoryHelper.bindDataCategorySelectOps));
      if (parentId === 0) {
        categoryInfos = [
          {
            id: 0,
            name: 'Root Category',
            // imageThumb: `${req.protocol}://${req.get('host')}/assets/icons/category-icon.png`,
            imageThumb: genUrlMediaByFolderType(req.protocol, req.hostname, EnumFolderType.CATEGORY.id, '0d45f0406c93794bae645c1cbb8353b5.png'),
            isActive: true,
            parentId: null,
            children: categoryInfos,
          },
        ];
      }
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: categoryInfos,
      } as any);
      // return sendApiResponseData(res, EnumResult.SUCCESS, { data: {} });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };
}

export default CategoryController;
