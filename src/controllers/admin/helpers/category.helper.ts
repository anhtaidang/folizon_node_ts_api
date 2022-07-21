import { EnumFolderType } from '@/constants/enum';
import { CategoryTreeDTO } from '@/interfaces/category.interface';
import { genS3MediaUrlByFolderType, isNullOrEmpty } from '@/utils/util';

class CategoryHelper {
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
}

export default CategoryHelper;
