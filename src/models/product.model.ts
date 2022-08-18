import moment from 'moment';
import { Sequelize, DataTypes, Model, Optional, ModelDefined, ModelCtor } from 'sequelize';
import { ProductDTO } from '@/interfaces/product.interface';
import { getBooleanFromTinyint } from '@/utils/util';

export type ProductCreationAttributes = Optional<ProductDTO, 'id' | 'createdBy' | 'createdTime' | 'updatedBy' | 'updatedTime'>;

export class ProductModel extends Model<ProductDTO, ProductCreationAttributes> implements ProductDTO {
  public id: number;
  public categoryId: number;
  public shopId: number;
  public title: string;
  public urlRewrite: string;
  public content: string;
  public description: string;
  public imageThumb: string;
  public retailPrice: number;
  public salePrice: number;
  public isActive: boolean;
  public hashTags: string;
  public availibilityStatusType: number;
  public statusType: number;
  public isFreeDelivery: boolean;
  public isBestSeller: boolean;
  public viewCount: number;
  public likeCount: number;
  public extraData: string;
  public createdBy: number;
  public createdTime: number;
  public updatedBy: number;
  public updatedTime: number;
}

export default function (dbConn: Sequelize, nameDefine = 'productTab'): ModelCtor<ProductModel> {
  return dbConn.define(
    nameDefine,
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      categoryId: { type: DataTypes.BIGINT, field: 'category_id' },
      shopId: { type: DataTypes.BIGINT, field: 'shop_id' },
      title: { type: DataTypes.STRING },
      isActive: { type: DataTypes.TINYINT, defaultValue: 1, field: 'is_active' },
      isFreeDelivery: { type: DataTypes.TINYINT, defaultValue: 0, field: 'is_free_delivery' },
      isBestSeller: { type: DataTypes.TINYINT, defaultValue: 0, field: 'is_best_seller' },
      description: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
      },
      urlRewrite: {
        type: DataTypes.STRING,
        field: 'url_rewrite',
      },
      imageThumb: {
        type: DataTypes.STRING,
        field: 'image_thumb',
      },
      hashTags: {
        type: DataTypes.STRING,
        field: 'hash_tags',
      },
      retailPrice: {
        type: DataTypes.BIGINT,
        field: 'retail_price',
      },
      salePrice: {
        type: DataTypes.BIGINT,
        field: 'sale_price',
      },
      likeCount: {
        type: DataTypes.INTEGER,
        field: 'like_count',
      },
      viewCount: {
        type: DataTypes.INTEGER,
        field: 'view_count',
      },
      availibilityStatusType: {
        type: DataTypes.INTEGER,
        field: 'availibility_status_type',
      },
      statusType: {
        type: DataTypes.INTEGER,
        field: 'status_type',
      },
      extraData: {
        type: DataTypes.INTEGER,
        field: 'extra_data',
      },
      createdTime: {
        allowNull: false,
        defaultValue: moment().unix(),
        type: DataTypes.INTEGER,
        field: 'created_time',
      },
      createdBy: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'created_by',
      },
      updatedTime: {
        type: DataTypes.INTEGER,
        field: 'updated_time',
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        field: 'updated_by',
      },
    },
    {
      getterMethods: {
        isActive() {
          return getBooleanFromTinyint(this.getDataValue('isActive'));
        },
        isFreeDilivery() {
          return getBooleanFromTinyint(this.getDataValue('isFreeDilivery'));
        },
        isBestSeller() {
          return getBooleanFromTinyint(this.getDataValue('isBestSeller'));
        },
      },
      tableName: 'product_tab',
    },
  );
}
