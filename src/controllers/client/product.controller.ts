import { NextFunction, Response } from 'express';
import { RequestBodyType } from '@/interfaces/common.interface';
import ProductService from '@/services/product.service';
import { sendApiResponseData, sendError } from '../utils';
import { EnumResult } from '@/constants/enumCommon';
import ProductHelper from './helpers/product.helper';

class ProdcutController {
  private productService = new ProductService();
  private productHelper = new ProductHelper();
  public getProductDetailInfo = async (req: RequestBodyType<any>, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.body;
      const product = await this.productService.findOne({
        where: {
          isActive: true,
          id: productId,
        },
        include: ['categoryMap', 'shopMap'],
      });

      if (product) {
        return sendApiResponseData(res, EnumResult.SUCCESS, { data: this.productHelper.bindProductDetail(product) });
      }
      return sendApiResponseData(res, EnumResult.ERROR_DATA_INVALID, { data: null });
    } catch (e) {
      sendError(res, next);
      throw e;
    }
  };
}

export default ProdcutController;
