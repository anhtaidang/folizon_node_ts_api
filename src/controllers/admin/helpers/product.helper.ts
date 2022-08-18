import moment from 'moment';
import { EnumDateTimeFormatFull, EnumFolderType, EnumProductAvailibilityType, EnumProductStatusType } from '@/constants/enum';
import { ProductDTO } from '@/interfaces/product.interface';
import { genS3MediaUrlByFolderType, getFieldEnumConfig, getFileNameFromUrl, slugify, validateImageBase64 } from '@/utils/util';
import MediaService from '@/services/media.service';
import { OptionalType } from '@/types';

class ProductHelper {
  private mediaService = new MediaService();
  public bindProductInfo = (dict: ProductDTO) => {
    const extraData = dict?.extraData ? JSON.parse(dict.extraData) : {};
    return {
      id: dict.id,
      title: dict.title,
      urlRewrite: dict.urlRewrite,
      description: dict.description,
      content: dict.content,
      salePrice: dict.salePrice,
      retailPrice: dict.retailPrice,
      availibilityStatusType: dict.availibilityStatusType,
      availibilityStatusTypeName: getFieldEnumConfig({
        value: dict.availibilityStatusType,
        enumConfig: EnumProductAvailibilityType,
      }),
      statusType: dict.statusType,
      statusTypeName: getFieldEnumConfig({ value: dict.statusType, enumConfig: EnumProductStatusType }),
      hashTags: dict.hashTags?.length > 0 ? dict.hashTags.split(',') : [],
      discount: extraData?.discount,
      isSaleOff: extraData?.isSaleOff || false,
      likeCount: dict.likeCount,
      viewCount: dict.viewCount,
      categoryName: dict.categoryMap?.name || 'Root Category',
      categoryId: dict.categoryMap?.id || 0,
      shopId: dict?.shopMap?.id || 0,
      shopName: dict?.shopMap?.name || 'No Shop',
      isActive: dict.isActive,
      isFreeDelivery: dict.isFreeDelivery,
      isBestSeller: dict.isBestSeller,
      imageThumb: genS3MediaUrlByFolderType(EnumFolderType.PRODUCT.id, dict.imageThumb),
      imageGalleries: extraData?.imageGalleries?.map(m => genS3MediaUrlByFolderType(EnumFolderType.PRODUCT.id, m)) || [],
      highlights: extraData?.highlights || [],
      classify: extraData?.classify,
      createdBy: dict.userCreated?.fullname,
      createdTime: moment.unix(dict.createdTime).format(EnumDateTimeFormatFull),
      updatedBy: dict.userUpdated?.fullname,
      updatedTime: dict.updatedTime ? moment.unix(dict.updatedTime).format(EnumDateTimeFormatFull) : null,
    };
  };

  public getCreateUpdateProductDict = async ({ dict, oldDict }: { dict: any; oldDict?: any }): Promise<OptionalType<ProductDTO>> => {
    const { imageThumb: image, discount, imageGalleries, highlights, isSaleOff } = dict;

    const extraData: any = { isSaleOff };

    const { classify } = dict;

    if (classify) {
      extraData.classify = classify;
    }

    if (highlights) {
      extraData.highlights = highlights;
    }

    if (discount) {
      extraData.discount = discount;
    }

    let imageThumb = null;
    if (validateImageBase64(image)) {
      const responseThumbImage = await this.mediaService.uploadImage({
        imageContent: image,
        folderType: EnumFolderType.PRODUCT.id,
        subPrefix: 'prod-thumb',
      });
      imageThumb = responseThumbImage.imageName;
      if (oldDict) {
        this.mediaService.deleteFileInFTPS3(EnumFolderType.PRODUCT.foldername, oldDict.imageThumb);
      }
    } else {
      imageThumb = getFileNameFromUrl(image);
    }

    if (imageGalleries) {
      const newImages = [];
      extraData.imageGalleries = await Promise.all(
        imageGalleries?.map(async m => {
          let result = null;
          if (validateImageBase64(m)) {
            const responseThumbImage = await this.mediaService.uploadImage({
              imageContent: m,
              folderType: EnumFolderType.PRODUCT.id,
              subPrefix: 'prod-gallery',
            });
            result = responseThumbImage.imageName;
          } else {
            result = getFileNameFromUrl(m);
          }
          newImages.push(result);
          return result;
        }),
      );
      if (oldDict) {
        const oldExtraData = oldDict?.extraData ? JSON.parse(oldDict?.extraData) : {};
        if (oldExtraData?.imageGalleries?.length > 0) {
          const oldImages = oldExtraData?.imageGalleries.filter(f => !newImages.includes(f));
          oldImages.forEach(element => {
            this.mediaService.deleteFileInFTPS3(EnumFolderType.PRODUCT.foldername, element);
          });
        }
      }
    }

    const data: OptionalType<ProductDTO> = {
      id: dict.id,
      categoryId: dict.categoryId,
      shopId: dict.shopId,
      title: dict.title,
      description: dict.description,
      content: dict.content,
      retailPrice: dict.retailPrice,
      salePrice: dict.salePrice,
      availibilityStatusType: dict.availibilityStatusType,
      statusType: dict.statusType,
      isActive: dict.isActive,
      isFreeDelivery: dict.isFreeDelivery,
      isBestSeller: dict.isBestSeller,
      hashTags: dict.hashTags?.toString(),
      urlRewrite: `${slugify(dict.title)}-t${moment().unix()}`,
      imageThumb,
      extraData: extraData ? JSON.stringify(extraData) : null,
    };
    if (dict.id) {
      data.id = dict.id;
      data.updatedBy = dict.uid;
      data.updatedTime = moment().unix();
    } else {
      data.createdBy = dict.uid;
      data.createdTime = moment().unix();
    }
    return data;
  };
}

export default ProductHelper;
