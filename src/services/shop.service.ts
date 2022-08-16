import DB from '@/databases';
import { CreateShopDTO, ShopDTO, UpdateShopDTO } from '@/interfaces/shop.interface';
import { DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

class ShopService {
  public category = DB.Shop;
  public async findAll(option?: FindOptions<ShopDTO>): Promise<ShopDTO[]> {
    return this.category.findAll({ ...option, raw: true, nest: true });
  }

  public async findOne(option?: FindOptions<ShopDTO>): Promise<ShopDTO> {
    return this.category.findOne(option);
  }

  public async findById(userId: number, options?: FindOptions<ShopDTO>): Promise<ShopDTO> {
    return this.category.findByPk(userId, options);
  }

  public async create(categoryData: CreateShopDTO): Promise<ShopDTO> {
    return this.category.create(categoryData);
  }

  public async update(data: UpdateShopDTO, options?: UpdateOptions<ShopDTO>): Promise<[number, ShopDTO[]]> {
    return this.category.update(data, options);
  }

  public async delete(options?: DestroyOptions<ShopDTO>): Promise<number> {
    return this.category.destroy(options);
  }
}

export default ShopService;
