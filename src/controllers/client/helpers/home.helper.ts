import { EnumFolderType } from '@/constants/enum';
import { CategoryDTO } from '@/interfaces/category.interface';
import { genURLS3ByFolderType } from '@/utils/util';
import { CategoryMapProduct } from '../interfaces/common';

class HomeHelper {
  public bindCategory = <Type>(
    item: CategoryDTO,
  ): CategoryMapProduct<Pick<CategoryDTO, 'id' | 'name' | 'urlRewrite' | 'imageThumb' | 'imageBanner'>, Type> => {
    return {
      id: item.id,
      name: item.name,
      urlRewrite: item.urlRewrite,
      imageThumb: genURLS3ByFolderType(EnumFolderType.CATEGORY.id, item.imageThumb),
      imageBanner: genURLS3ByFolderType(EnumFolderType.CATEGORY.id, item.imageBanner),
    };
  };
}

export default HomeHelper;
