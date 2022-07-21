// import sequelize, { Sequelize, DataTypes, Model, Optional, ModelDefined } from 'sequelize';
import moment from 'moment';
import { Sequelize, DataTypes, Model, Optional, ModelDefined, ModelCtor } from 'sequelize';
import { getBooleanFromTinyint } from '@/utils/util';
import { CategoryDTO } from '@/interfaces/category.interface';

export type CategoryCreationAttributes = Optional<CategoryDTO, 'id' | 'createdBy' | 'createdTime' | 'updatedBy' | 'updatedTime'>;

export class CategoryModel extends Model<CategoryDTO, CategoryCreationAttributes> implements CategoryDTO {
  public id: number;
  public name: string;
  public urlRewrite: string;
  public description: string;
  public imageBanner: string;
  public imageThumb: string;
  public isActive: boolean;
  public parentId: number;
  public hashTags: string;
  public createdTime: number;
  public createdBy: number;
  public updatedTime: number;
  public updatedBy: number;
}

export default function (dbConn: Sequelize, nameDefine = 'categoryTab'): ModelCtor<CategoryModel> {
  return dbConn.define(
    nameDefine,
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      parentId: { type: DataTypes.INTEGER, field: 'parent_id' },
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
      tableName: 'category_tab',
    },
  );
}
