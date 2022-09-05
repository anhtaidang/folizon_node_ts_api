import DB from '@databases';
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from '@/interfaces/product.interface';
import { BulkCreateOptions, CreateOptions, FindOptions, UpdateOptions } from 'sequelize/types/lib/model';

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

  public async create(data: CreateProductDTO, options?: CreateOptions<ProductDTO>): Promise<ProductDTO> {
    return this.product.create(data, options);
  }

  public async bulkCreate(datas: CreateProductDTO[], options?: BulkCreateOptions<ProductDTO>): Promise<ProductDTO[]> {
    return this.product.bulkCreate(datas, options);
  }

  public async update(data: UpdateProductDTO, options?: UpdateOptions<ProductDTO>): Promise<[number, ProductDTO[]]> {
    return this.product.update(data, options);
  }
}

export default ProductService;
