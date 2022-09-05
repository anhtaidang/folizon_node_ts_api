import config from 'config';
import cheerio from 'cheerio';
import rq from 'request-promise';
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
import { OptionalType } from '@/types';

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

      const response = await this.productService.findAll({
        where: { id: { [DBOp.in]: productIds } },
        include: ['shopMap', 'userCreated', 'userUpdated'],
      });
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
        include: ['shopMap', 'userCreated', 'userUpdated'],
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
  public updateProduct = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
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
  public crawlProductFromTiki = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
    try {
      const host = 'https://tiki.vn';
      await rq(`${host}/dien-thoai-may-tinh-bang/c1789`, async (error, response, html) => {
        // gửi request đến trang
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html); // load HTML

          const resUrl = [];
          let resData = [];
          $('.product-item').each((index, el) => {
            const elmAttr = $(el).attr();
            resUrl.push(`${elmAttr.href}`);
          });

          const parsePriceNum = value => {
            return value ? parseFloat(value.replace(/[.]/g, '')) : 0;
          };

          const list = resUrl.map(async url => {
            let obj = null;
            await rq(`${host}${url}`, (error, response, html) => {
              if (!error && response.statusCode == 200) {
                const $$ = cheerio.load(html); // load HTML
                const title = $$('h1.title').text();
                const img = $$('.group-images .thumbnail picture img').attr();
                const flashSalePrice = $$('.flash-sale-price span').html();
                const listPrice = $$('.flash-sale-price .sale .list-price').html();
                const productPrice = $$('.product-price__list-price').html();
                const productCurrentPrice = $$('.product-price__current-price').html();
                obj = {
                  categoryId: 2,
                  shopId: 1,
                  urlRewrite: url.split('.')[0].replace('/', ''),
                  title,
                  imageThumb: img?.src,
                  price: parsePriceNum(productPrice || productCurrentPrice || listPrice),
                  salePrice: parsePriceNum(flashSalePrice),
                  crawlType: 'TIKI',
                  createdBy: 1,
                } as OptionalType<ProductDTO>;
              }
            });
            return obj;
          });
          resData = await Promise.all(list);
          // const data = await Promise.all(resData.map(m => this.productService.create(m, { ignoreDuplicates: true })));
          const data = await this.productService.bulkCreate(resData, { ignoreDuplicates: true });
          sendApiResponseData(res, EnumResult.SUCCESS, { data });
        }
      });
    } catch (e) {
      sendError(res, next)(e);
      throw e;
    }
  };
}

export default ProductController;
