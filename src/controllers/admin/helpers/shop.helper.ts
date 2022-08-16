import { EnumDateTimeFormatFull, EnumFolderType } from '@/constants/enum';
import { ShopDTO } from '@/interfaces/shop.interface';
import MediaService from '@/services/media.service';
import { OptionalType } from '@/types';
import { genURLS3ByFolderType, getFileNameFromUrl, isNullOrEmpty, slugify, validateImageBase64 } from '@/utils/util';
import moment from 'moment';

class ShopHelper {
  private mediaService = new MediaService();
  public bindShopInfo = (dict: ShopDTO) => {
    return {
      id: dict.id,
      name: dict.name,
      urlRewrite: dict.urlRewrite,
      ownId: dict.uid,
      ownName: dict.userOwn?.fullname,
      description: dict.description,
      hashTags: dict.hashTags?.split(',') || [],
      isActive: dict.isActive,
      imageThumb: !isNullOrEmpty(dict.imageThumb) ? genURLS3ByFolderType(EnumFolderType.SHOP.id, dict.imageThumb) : null,
      imageBanner: !isNullOrEmpty(dict.imageBanner) ? genURLS3ByFolderType(EnumFolderType.SHOP.id, dict.imageBanner) : null,
      createdBy: dict.userCreated?.fullname,
      createdTime: dict.createdTime ? moment(dict.createdTime).format(EnumDateTimeFormatFull) : null,
      updatedBy: dict.userUpdated?.fullname,
      updatedTime: dict.updatedTime ? moment(dict.updatedTime).format(EnumDateTimeFormatFull) : null,
    };
  };
  public getCreateUpdateShopDict = async (dict: any, oldDict?: any) => {
    let imageThumb = null;
    if (validateImageBase64(dict.imageThumb)) {
      const response = await this.mediaService.uploadImage({
        imageContent: dict.imageThumb,
        folderType: EnumFolderType.SHOP.id,
        subPrefix: 'shop-thumb',
      });
      imageThumb = response?.imageName;
      if (oldDict) {
        this.mediaService.deleteFileInFTPS3(EnumFolderType.SHOP.foldername, oldDict.imageThumb);
      }
    } else {
      imageThumb = getFileNameFromUrl(dict.imageThumb);
    }

    let imageBanner = null;
    if (validateImageBase64(dict.imageBanner)) {
      const response = await this.mediaService.uploadImage({
        imageContent: dict.imageBanner,
        folderType: EnumFolderType.SHOP.id,
        subPrefix: 'shop-banner',
      });
      imageBanner = response?.imageName;
      if (oldDict) {
        this.mediaService.deleteFileInFTPS3(EnumFolderType.SHOP.foldername, oldDict.imageBanner);
      }
    } else {
      imageBanner = getFileNameFromUrl(dict.imageBanner);
    }

    const data: OptionalType<ShopDTO> = {
      uid: dict.uid,
      name: dict.name,
      urlRewrite: `${slugify(dict.name)}-t${moment().unix()}`,
      description: dict.description,
      isActive: dict.isActive,
      hashTags: dict.hashTags?.toString(),
      imageThumb,
      imageBanner,
      extraData: dict.extraData,
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

export default ShopHelper;
