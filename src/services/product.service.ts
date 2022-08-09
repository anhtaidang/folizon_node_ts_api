import DB from '@databases';
import { CreateProductDTO, ProductDTO } from '@/interfaces/product.interface';
import { FindOptions } from 'sequelize/types/lib/model';

class ProductService {
  public product = DB.Product;
  public async findAll(option?: FindOptions<ProductDTO>): Promise<ProductDTO[]> {
    return this.product.findAll({ ...option, raw: true, nest: true });
  }

  public async findOne(option?: FindOptions<ProductDTO>): Promise<ProductDTO> {
    return this.product.findOne(option);
  }

  public async findById(userId: number, options?: FindOptions<ProductDTO>): Promise<ProductDTO> {
    return this.product.findByPk(userId, options);
  }

  public async create(data: CreateProductDTO): Promise<ProductDTO> {
    return this.product.create(data);
  }
}

export default ProductService;
