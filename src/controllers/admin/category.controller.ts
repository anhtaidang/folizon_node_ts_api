import { EnumResult } from '@constants/enumCommon';
import { NextFunction, Response } from 'express';
import { sendApiResponseData, sendError } from '../utils';
import { RequestBodyType } from '@interfaces/common.interface';
import { CategoryGetIdsReq, CategoryGetInfosReq, CategoryGetTreeReq } from './interfaces/category';
import { genUrlMediaByFolderType, isNullOrEmpty, removeParamRequest } from '@/utils/util';
import { EnumFolderType } from '@/constants/enum';
import CategoryService from '@/services/category.service';
import CategoryHelper from './helpers/category.helper';
import { CategoryTreeDTO, CreateCategoryDTO, UpdateCategoryDTO } from '@/interfaces/category.interface';
import { DBOp } from '@/databases';
import AuthController from './auth.controller';

class CategoryController {
  private authController = new AuthController();
  private categoryService = new CategoryService();
  private categoryHelper = new CategoryHelper();
  public getCategoryIds = async (req: RequestBodyType<CategoryGetIdsReq>, res: Response, next: NextFunction) => {
    try {
      let requestSearch: any = {};
      const { id, name, parentId } = req.body;
      if (!isNullOrEmpty(id)) {
        requestSearch.id = id === 0 ? null : id;
      }
      if (!isNullOrEmpty(parentId)) {
        requestSearch.parentId = parentId;
      }
      if (!isNullOrEmpty(name)) {
        requestSearch = { ...requestSearch, name: { [DBOp.like]: `%${name}%` } };
      }
      const categoryIds = await this.categoryService.findAll({
        where: removeParamRequest(requestSearch),
        attributes: ['id'],
        order: [
          ['parentId', 'ASC'],
          ['createdTime', 'DESC'],
        ],
      });
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: { categoryIds: categoryIds.map(m => m.id) },
      } as any);
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };

  public getCategoryInfos = async (req: RequestBodyType<CategoryGetInfosReq>, res: Response, next: NextFunction) => {
    try {
      const { categoryIds } = req.body;
      let categoryInfos = await this.categoryService.findAll({
        where: { id: { [DBOp.in]: categoryIds } },
      });
      // categoryInfos = await Promise.all(categoryInfos.map(services.category.getCombineTreeNodeCategory));
      const categoryInfosMap = categoryInfos.map(m => this.categoryHelper.bindDataTreeNodeCategory(m, this.categoryHelper.bindCategoryInfo));
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: { categoryInfos: categoryInfosMap },
      });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };

  public createCategory = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
    try {
      const userLogin = await this.authController.getCurrentUserLogin(req);
      let responseData = null;
      let codeResult = EnumResult.FAILD;
      if (userLogin) {
        const { uid } = userLogin;
        const dictData = (await this.categoryHelper.getCreateUpdateCategoryDict({ uid, ...req.body })) as CreateCategoryDTO;
        responseData = await this.categoryService.create(dictData);
        codeResult = EnumResult.SUCCESS;
      }
      return res.send();
      // return sendApiResponseData(res, codeResult, { data: responseData });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
  public updateCategory = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
    try {
      let codeResult = EnumResult.FAILD;
      let responseData = null;
      const { parentId, id } = req.body;
      if (parentId === id) {
        responseData = {
          errorMessage: 'Can not get Parent is your.',
        };
      } else {
        const userLogin = await this.authController.getCurrentUserLogin(req);
        if (userLogin) {
          const { uid } = userLogin;

          const oldDict = await this.categoryService.findOne({ where: { id } });
          const dictParams = (await this.categoryHelper.getCreateUpdateCategoryDict({ uid, ...req.body }, oldDict)) as UpdateCategoryDTO;
          responseData = await this.categoryService.update(dictParams, {
            where: { id },
          });
          codeResult = EnumResult.SUCCESS;
        }
      }
      return sendApiResponseData(res, codeResult, { data: responseData });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
  public deleteCategoryByIds = async (req: RequestBodyType<{ categoryIds: number[] }>, res: Response, next: NextFunction) => {
    try {
      const { categoryIds } = req.body;
      let codeResult = EnumResult.FAILD;
      let responseData = null;
      if (categoryIds && categoryIds.length > 0) {
        const idExcludes = [];
        for (const id of categoryIds) {
          const categories = await this.categoryService.findAll({
            attributes: ['id'],
            where: { parentId: id },
          });
          if (categories.length > 0) {
            idExcludes.push(id);
          }
        }
        if (idExcludes.length > 0) {
          responseData = {
            ...responseData,
            errorMessage: `[${idExcludes.map(m => m)}] can not delete, this have children Category.`,
          };
        }
        const idEffect = categoryIds.filter(f => !idExcludes.includes(f));
        if (idEffect.length > 0) {
          const responseDelete = await this.categoryService.delete({
            where: {
              id: { [DBOp.in]: idEffect },
            },
          });
          responseData = {
            ...responseData,
            responseDelete,
          };
          codeResult = EnumResult.SUCCESS;
        }
      }
      return sendApiResponseData(res, codeResult, { data: responseData });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
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
        data: { categoryInfos },
      } as any);
      // return sendApiResponseData(res, EnumResult.SUCCESS, { data: {} });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };
}

export default CategoryController;
