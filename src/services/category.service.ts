import DB from '@databases';
import { CategoryDTO, CreateCategoryDTO } from '@/interfaces/category.interface';
import { FindOptions, UpdateOptions } from 'sequelize/types/lib/model';

class CategoryService {
  public category = DB.Category;
  public async findAll(option?: FindOptions<CategoryDTO>): Promise<CategoryDTO[]> {
    return this.category.findAll({ ...option, raw: true, nest: true });
  }

  public async findOne(option?: FindOptions<CategoryDTO>): Promise<CategoryDTO> {
    return this.category.findOne(option);
  }

  public async findById(userId: number, options?: FindOptions<CategoryDTO>): Promise<CategoryDTO> {
    return this.category.findByPk(userId, options);
  }

  public async create(categoryData: CreateCategoryDTO): Promise<CategoryDTO> {
    return this.category.create(categoryData);
  }

  public async update(data: CategoryDTO, options?: UpdateOptions<CategoryDTO>): Promise<[number, CategoryDTO[]]> {
    return this.category.update(data, options);
  }

  public async getCombineTreeNodeCategory(node: any): Promise<CategoryDTO> {
    let obj = { ...node };
    if (obj) {
      let children = await this.findAll({ where: { parentId: obj.id } });
      if (children && children.length > 0) {
        children = await Promise.all(children.map(m => this.getCombineTreeNodeCategory(m)));
        obj = {
          ...obj,
          children,
        };
      }
    }
    return obj;
  }
}

export default CategoryService;
