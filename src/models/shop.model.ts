import moment from 'moment';
import { Sequelize, DataTypes, Model, Optional, ModelDefined, ModelCtor } from 'sequelize';
import { getBooleanFromTinyint } from '@/utils/util';
import { ShopDTO } from '@/interfaces/shop.interface';

export type ShopCreationAttributes = Optional<ShopDTO, 'id' | 'createdBy' | 'createdTime' | 'updatedBy' | 'updatedTime'>;

export class ShopModel extends Model<ShopDTO, ShopCreationAttributes> implements ShopDTO {
  public id: number;
  public uid: number;
  public name: string;
  public urlRewrite: string;
  public description: string;
  public imageBanner: string;
  public imageThumb: string;
  public isActive: boolean;
  public extraData: string;
  public hashTags: string;
  public createdTime: number;
  public createdBy: number;
  public updatedTime: number;
  public updatedBy: number;
}

export default function (dbConn: Sequelize, nameDefine = 'shopTab'): ModelCtor<ShopModel> {
  return dbConn.define(
    nameDefine,
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      uid: { type: DataTypes.INTEGER },
      name: { type: DataTypes.STRING },
      isActive: { type: DataTypes.TINYINT, defaultValue: 1, field: 'is_active' },
      description: {
        type: DataTypes.STRING,
        field: 'description',
      },
      urlRewrite: {
        type: DataTypes.STRING,
        field: 'url_rewrite',
      },
      imageBanner: {
        type: DataTypes.STRING,
        field: 'image_banner',
      },
      imageThumb: {
        type: DataTypes.STRING,
        field: 'image_thumb',
      },
      hashTags: {
        type: DataTypes.STRING,
        field: 'hash_tags',
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
      },
      tableName: 'shop_tab',
    },
  );
}
