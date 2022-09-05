import { ROOT_CATEGORY_URL_REWRITE } from '@/constants/constants';
import { EnumFolderType } from '@/constants/enum';
import { ProductDTO } from '@/interfaces/product.interface';
import { genURLS3ByFolderType } from '@/utils/util';
import { ProductItem } from '../interfaces/common';

class CommonHelper {
  public bindProductItem = (dict: ProductDTO): ProductItem => {
    const extraData = JSON.parse(dict.extraData);
    return {
      id: dict.id,
      title: dict.title,
      urlDetail: `/${dict.categoryMap?.urlRewrite || ROOT_CATEGORY_URL_REWRITE}/${dict.urlRewrite}`,
      urlRewrite: dict.urlRewrite,
      price: dict.price,
      salePrice: dict.salePrice,
      retailPrice: dict.retailPrice,
      discount: extraData?.discount,
      likeCount: dict.likeCount,
      viewCount: dict.viewCount,
      isSaleOff: extraData?.isSaleOff || false,
      isFreeDelivery: dict.isFreeDelivery,
      isBestSeller: dict.isBestSeller,
      categoryId: dict.categoryMap?.id || 0,
      categoryRewrite: dict.categoryMap?.urlRewrite || ROOT_CATEGORY_URL_REWRITE,
      categoryName: dict.categoryMap?.name || 'Root Category',
      //   shopId: dict.shopMap?.id,
      //   shopName: dict.shopMap?.name,
      imageThumb: genURLS3ByFolderType(EnumFolderType.PRODUCT.id, dict.imageThumb),
    };
  };
}

export default CommonHelper;
