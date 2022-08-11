import config from 'config';
import { NextFunction, Response } from 'express';
import { sendApiResponseData, sendError } from '../utils';
import { RequestBodyType } from '@interfaces/common.interface';
import { ProductIdsReq, ProductInfoByKeywordReq, ProductInfosReq } from './interfaces/product';
import { EnumResult } from '@/constants/enumCommon';
import { isEmptyObject, removeParamRequest } from '@/utils/util';
import { DBOp } from '@/databases';
import ProductService from '@/services/product.service';
import ProductHelper from './helpers/product.helper';
import AuthController from './auth.controller';
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from '@/interfaces/product.interface';

class ProductController {
  private authController = new AuthController();
  private productService = new ProductService();
  private productHelper = new ProductHelper();
  public getProductIds = async (req: RequestBodyType<ProductIdsReq>, res: Response, next: NextFunction) => {
    try {
      const codeResult = EnumResult.SUCCESS;
      const { titleKeyword } = req.body;
      const searchData = removeParamRequest({
        title: !isEmptyObject(titleKeyword)
          ? {
              [DBOp.like]: `%${titleKeyword}%`,
            }
          : null,
      });

      const response = await this.productService.findAll({ where: searchData, include: null });
      return sendApiResponseData(res, codeResult, { data: { productIds: response.map(m => m.id) } });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };
  public getProductInfos = async (req: RequestBodyType<ProductInfosReq>, res: Response, next: NextFunction) => {
    try {
      const codeResult = EnumResult.SUCCESS;
      const { productIds } = req.body;

      const response = await this.productService.findAll({ where: { id: { [DBOp.in]: productIds } }, include: null });
      return sendApiResponseData(res, codeResult, { data: { productInfos: response.map(this.productHelper.bindProductInfo) } });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };
  public getProductInfoByKeyword = async (req: RequestBodyType<ProductInfoByKeywordReq>, res: Response, next: NextFunction) => {
    try {
      const codeResult = EnumResult.SUCCESS;
      const { keyword, isActive } = req.body;
      let productInfos = await this.productService.findAll({
        where: removeParamRequest({ title: { [DBOp.like]: `%${keyword}%` }, isActive }),
      });
      const producInfosMap = productInfos.map(m => ({
        productId: m.id,
        productTitle: m.title,
        isActive: m.isActive,
      }));
      return sendApiResponseData(res, codeResult, { data: { productInfos: producInfosMap } });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };
  public createProduct = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
    try {
      const userLogin = await this.authController.getCurrentUserLogin(req);
      let responseData = null;
      let codeResult = EnumResult.FAILD;
      if (userLogin) {
        const { uid } = userLogin;
        const dictParam = (await this.productHelper.getCreateUpdateProductDict({
          dict: {
            uid,
            ...req.body,
          },
        })) as CreateProductDTO;

        responseData = await this.productService.create(dictParam);
        codeResult = EnumResult.SUCCESS;
      }
      return sendApiResponseData(res, codeResult, responseData);
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
  public updateProduct = async (req, res, next) => {
    try {
      let codeResult = EnumResult.FAILD;
      let responseData = null;
      const userLogin = await this.authController.getCurrentUserLogin(req);
      if (userLogin) {
        const { uid } = userLogin;

        const oldDict = await this.productService.findOne({ where: { id: req.body.id } });

        const dictParam = (await this.productHelper.getCreateUpdateProductDict({
          dict: {
            uid,
            ...req.body,
          },
          oldDict,
        })) as UpdateProductDTO;

        responseData = await this.productService.update(dictParam, { where: { id: dictParam.id } });
        codeResult = EnumResult.SUCCESS;
      }
      return sendApiResponseData(res, codeResult, responseData);
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
}

export default ProductController;
