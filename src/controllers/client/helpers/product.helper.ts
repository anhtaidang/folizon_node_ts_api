import { EnumFolderType, EnumProductAvailibilityType } from '@/constants/enum';
import { ProductDTO } from '@/interfaces/product.interface';
import { genURLS3ByFolderType, getFieldEnumConfig } from '@/utils/util';

class ProductHelper {
  public bindProductDetail = (dict: ProductDTO) => {
    const extraData = JSON.parse(dict.extraData);
    return {
      id: dict.id,
      title: dict.title,
      urlRewrite: dict.urlRewrite,
      description: dict.description,
      content: dict.content,
      price: dict.price,
      salePrice: dict.salePrice,
      retailPrice: dict.retailPrice,
      shopId: dict.shopMap?.id,
      shopName: dict.shopMap?.name,
      shopImageThumb: genURLS3ByFolderType(EnumFolderType.SHOP.id, dict?.shopMap.imageThumb),
      categoryId: dict?.categoryMap?.id || 0,
      categoryName: dict?.categoryMap?.name || 'Root',
      categoryRewrite: dict?.categoryMap?.urlRewrite || '',
      discount: extraData?.discount,
      isSaleOff: extraData?.isSaleOff || false,
      highlights: extraData?.highlights || [],
      classify: extraData?.classify,
      isFreeDelivery: dict.isFreeDelivery,
      isBestSeller: dict.isBestSeller,
      availibilityStatusTypeName: getFieldEnumConfig({
        value: dict.availibilityStatusType,
        enumConfig: EnumProductAvailibilityType,
      }),
      imageGalleries: extraData ? extraData?.imageGalleries.map(m => genURLS3ByFolderType(EnumFolderType.PRODUCT.id, m)) : [],
      imageThumb: genURLS3ByFolderType(EnumFolderType.PRODUCT.id, dict.imageThumb),
    };
  };
}

export default ProductHelper;
