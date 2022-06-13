import config from 'config';
import { EnumResult } from '@constants/enumCommon';
import { NextFunction, Response } from 'express';
import { sendApiResponseData, sendError } from '../utils';
import { RequestBodyType } from '@interfaces/common.interface';
import { CategoryGetTreeReq } from './interfaces/category';
import { genUrlMediaByFolderType, removeParamRequest } from '@/utils/util';
import { EnumFolderType } from '@/constants/enum';

class CategoryController {
  public getCategoryTree = async (req: RequestBodyType<CategoryGetTreeReq>, res: Response, next: NextFunction) => {
    try {
      const { parentId = 0, id = null } = req.body;
      let categoryInfos = await services.category.findAll(removeParamRequest({ parentId, id }));
      categoryInfos = await Promise.all(categoryInfos.map(services.category.getCombineTreeNodeCategory));
      categoryInfos = categoryInfos.map(m =>
        commonHelper.categgory.bindDataTreeNodeCategory(m, {
          req,
          bindData: commonHelper.categgory.bindDataCategorySelectOps,
        }),
      );
      if (parentId === 0) {
        categoryInfos = [
          {
            id: 0,
            name: 'Root Category',
            // imageThumb: `${req.protocol}://${req.get('host')}/assets/icons/category-icon.png`,
            imageThumb: genUrlMediaByFolderType(
              req,
              EnumFolderType.CATEGORY.id,
              '0d45f0406c93794bae645c1cbb8353b5.png',
            ),
            isActive: true,
            parentId: null,
            children: categoryInfos,
          },
        ];
      }
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        categoryInfos,
      });
      return sendApiResponseData(res, EnumResult.SUCCESS, { data: {} });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };
}

export default CategoryController;
