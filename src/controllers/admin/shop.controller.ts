import { EnumResult } from '@/constants/enumCommon';
import { DBOp } from '@/databases';
import { RequestBodyType } from '@/interfaces/common.interface';
import { CreateShopDTO, UpdateShopDTO } from '@/interfaces/shop.interface';
import ProductService from '@/services/product.service';
import ShopService from '@/services/shop.service';
import { isNullOrEmpty } from '@/utils/util';
import { NextFunction, Response } from 'express';
import { where } from 'sequelize/types';
import { sendApiResponseData, sendError } from '../utils';
import AuthController from './auth.controller';
import ShopHelper from './helpers/shop.helper';

class ShopController {
  private shopService = new ShopService();
  private productService = new ProductService();
  private authController = new AuthController();
  private shopHelper = new ShopHelper();
  public getShopIds = async (req: RequestBodyType<{ keyword: string }>, res: Response, next: NextFunction) => {
    try {
      const requestSearch: any = {};
      const { keyword } = req.body;
      const valueKeyword = parseInt(keyword, 10);
      if (!isNaN(valueKeyword)) {
        requestSearch.id = valueKeyword;
      } else if (!isNullOrEmpty(keyword)) {
        requestSearch.name = { [DBOp.like]: `%${keyword}%` };
      }

      const shopIds = await this.shopService.findAll({
        where: requestSearch,
        attributes: ['id'],
        order: [
          ['updatedTime', 'DESC'],
          ['createdTime', 'DESC'],
        ],
      });
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: { shopIds: shopIds.map(m => m.id) },
      });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
  public getShopInfoByIds = async (req: RequestBodyType<{ shopIds: number[] }>, res: Response, next: NextFunction) => {
    try {
      const { shopIds } = req.body;
      const shopInfos = await this.shopService.findAll({
        where: { id: { [DBOp.in]: shopIds } },
      });
      const shopInfosMap = shopInfos.map(this.shopHelper.bindShopInfo);
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: { shopInfos: shopInfosMap },
      });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
  public getShopInfoByKeyWord = async (req: RequestBodyType<{ keyword: string }>, res: Response, next: NextFunction) => {
    try {
      const { keyword } = req.body;
      const shopInfos = await this.shopService.findAll({
        where: { name: { [DBOp.like]: `%${keyword}%` }, isActive: true },
      });
      const shopInfosMap = shopInfos.map(m => ({
        shopId: m.id,
        shopName: m.name,
      }));
      return sendApiResponseData(res, EnumResult.SUCCESS, {
        data: { shopInfos: shopInfosMap },
      });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
  public createShop = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
    try {
      const userLogin = await this.authController.getCurrentUserLogin(req);
      let responseData = null;
      let codeResult = EnumResult.FAILD;
      if (userLogin) {
        const { uid } = userLogin;
        responseData = await this.shopService.create((await this.shopHelper.getCreateUpdateShopDict({ uid, ...req.body })) as CreateShopDTO);
        codeResult = EnumResult.SUCCESS;
      }
      return sendApiResponseData(res, codeResult, { data: responseData });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
  public updateShop = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
    try {
      let codeResult = EnumResult.FAILD;
      let responseData = null;
      const { id } = req.body;
      const userLogin = await this.authController.getCurrentUserLogin(req);
      if (userLogin) {
        const { uid } = userLogin;
        const oldDict = await this.shopService.findOne({ where: { id } });
        responseData = await this.shopService.update((await this.shopHelper.getCreateUpdateShopDict({ uid, ...req.body }, oldDict)) as UpdateShopDTO);
        codeResult = EnumResult.SUCCESS;
      }
      return sendApiResponseData(res, codeResult, { data: responseData });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };

  public deleteShopByIds = async (req: RequestBodyType<{ shopIds: number[] }>, res: Response, next: NextFunction) => {
    try {
      const { shopIds } = req.body;
      let codeResult = EnumResult.FAILD;
      let responseData = null;
      if (shopIds && shopIds.length > 0) {
        const idExcludes = [];
        for (const id of shopIds) {
          const shops = await this.productService.findAll({
            attributes: ['id'],
            where: { shopId: id },
          });
          if (shops.length > 0) {
            idExcludes.push(id);
          }
        }
        if (idExcludes.length > 0) {
          responseData = {
            ...responseData,
            errorMessage: `[${idExcludes.map(m => m)}] can not delete, this have children Shop.`,
          };
        }
        const idEffect = shopIds.filter(f => !idExcludes.includes(f));
        if (idEffect.length > 0) {
          const responseDelete = await this.shopService.delete({
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
}

export default ShopController;
