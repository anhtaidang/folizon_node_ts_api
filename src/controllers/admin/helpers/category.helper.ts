import { EnumDateTimeFormatFull, EnumFolderType } from '@/constants/enum';
import { CategoryDTO, CategoryTreeDTO } from '@/interfaces/category.interface';
import MediaService from '@/services/media.service';
import { OptionalType } from '@/types';
import { genS3MediaUrlByFolderType, getFileNameFromUrl, isNullOrEmpty, slugify, validateImageBase64 } from '@/utils/util';
import moment from 'moment';

class CategoryHelper {
  private mediaService = new MediaService();
  public bindDataTreeNodeCategory = (node: CategoryTreeDTO, bindData: (...arg) => any | VoidFunction) => {
    let obj = bindData(node);
    if (obj) {
      const { children } = obj;
      if (children && children.length > 0) {
        obj = {
          ...obj,
          children: children.map(m => this.bindDataTreeNodeCategory(m, bindData)),
        };
      }
    }
    return obj;
  };

  public bindCategoryInfo = (dict: CategoryTreeDTO) => {
    let obj: Partial<Omit<CategoryTreeDTO, 'createdTime' | 'updatedTime'>> & { createdTime: any; updatedTime: any; parentName: string } = {
      id: dict.id,
      parentId: dict.parentId,
      name: dict.name,
      urlRewrite: dict.urlRewrite,
      parentName: dict.categoryMap?.name,
      description: dict.description,
      isActive: dict.isActive,
      imageThumb: !isNullOrEmpty(dict.imageThumb) ? genS3MediaUrlByFolderType(EnumFolderType.CATEGORY.id, dict.imageThumb) : null,
      imageBanner: !isNullOrEmpty(dict.imageBanner) ? genS3MediaUrlByFolderType(EnumFolderType.CATEGORY.id, dict.imageBanner) : null,
      userCreated: dict.userCreated,
      createdTime: dict.createdTime ? moment.unix(dict.createdTime).format(EnumDateTimeFormatFull) : null,
      userUpdated: dict.userUpdated,
      updatedTime: dict.updatedTime ? moment(dict.updatedTime).format(EnumDateTimeFormatFull) : null,
    };
    if (!isNullOrEmpty(dict.children)) {
      obj = {
        ...obj,
        children: dict.children,
      };
    }
    return obj;
  };
  public bindDataCategorySelectOps = (dict: CategoryTreeDTO) => {
    let obj: Partial<CategoryTreeDTO> = {
      id: dict.id,
      parentId: dict.parentId,
      name: dict.name,
      urlRewrite: dict.urlRewrite,
      isActive: dict.isActive,
      imageThumb: genS3MediaUrlByFolderType(EnumFolderType.CATEGORY.id, dict.imageThumb),
    };
    if (!isNullOrEmpty(dict.children)) {
      obj = {
        ...obj,
        children: dict.children,
      };
    }
    return obj;
  };

  public getCreateUpdateCategoryDict = async (dict: any, oldDict?: any) => {
    let imageThumb = null;
    if (validateImageBase64(dict.imageThumb)) {
      const response = await this.mediaService.uploadImage({
        imageContent: dict.imageThumb,
        folderType: EnumFolderType.CATEGORY.id,
        subPrefix: 'category-thumb',
      });
      imageThumb = response?.imageName;
      if (oldDict) {
        this.mediaService.deleteFileInFTPS3(EnumFolderType.CATEGORY.foldername, oldDict.imageThumb);
      }
    } else {
      imageThumb = getFileNameFromUrl(dict.imageThumb);
    }

    let imageBanner = null;
    if (validateImageBase64(dict.imageBanner)) {
      const response = await this.mediaService.uploadImage({
        imageContent: dict.imageBanner,
        folderType: EnumFolderType.CATEGORY.id,
        subPrefix: 'category-banner',
      });
      imageBanner = response?.imageName;
      if (oldDict) {
        this.mediaService.deleteFileInFTPS3(EnumFolderType.CATEGORY.foldername, oldDict.imageBanner);
      }
    } else {
      imageBanner = getFileNameFromUrl(dict.imageBanner);
    }

    const data: OptionalType<CategoryDTO> = {
      parentId: dict.parentId,
      name: dict.name,
      urlRewrite: slugify(dict.name),
      description: dict.description,
      isActive: dict.isActive,
      imageThumb,
      imageBanner,
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

export default CategoryHelper;
