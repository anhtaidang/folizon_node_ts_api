import { CategoryDTO, CreateCategoryDTO } from '@/interfaces/category.interface';
import DB from '@databases';
import { CreateUserDTO, UserDTO } from '@interfaces/users.interface';
import { FindOptions } from 'sequelize/types/lib/model';

class CategoryService {
  public category = DB.Category;

  public async findAll(option?: FindOptions<CategoryDTO>): Promise<CategoryDTO[]> {
    return this.category.findAll(option);
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
}

export default CategoryService;
