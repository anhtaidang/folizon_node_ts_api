// import sequelize, { Sequelize, DataTypes, Model, Optional, ModelDefined } from 'sequelize';
import { Sequelize, DataTypes, Model, Optional, ModelDefined, ModelCtor } from 'sequelize';
import { UserDTO } from '@interfaces/users.interface';
import moment from 'moment';
import { getBooleanFromTinyint } from '@/utils/util';

export type UserCreationAttributes = Optional<UserDTO, 'uid' | 'createdBy' | 'createdTime' | 'updatedBy' | 'updatedTime'>;

export class UserModel extends Model<UserDTO, UserCreationAttributes> implements UserDTO {
  public uid: number;
  public email: string;
  public username: string;
  public password: string;
  public avatar: string;
  public salt: string;
  public phone: string;
  public address: string;
  public isActive: boolean;
  public firstName: string;
  public lastName: string;
  public fullname: string;
  public extraData: string;
  public cityId: number;
  public districtId: number;
  public createdTime: number;
  public createdBy: number;
  public updatedTime: number;
  public updatedBy: number;
}

// export default function (sequelize: Sequelize): typeof UserModel {
//   return UserModel.init(
//     {
//       uid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//       email: { type: DataTypes.STRING },
//       username: { type: DataTypes.STRING, allowNull: false },
//       password: { type: DataTypes.STRING, allowNull: false },
//       avatar: { type: DataTypes.STRING },
//       salt: { type: DataTypes.STRING },
//       phone: { type: DataTypes.STRING, allowNull: false },
//       address: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
//       isActive: { type: DataTypes.TINYINT, defaultValue: 1, field: 'is_active' },
//       firstName: {
//         type: DataTypes.STRING,
//         field: 'first_name',
//       },
//       lastName: {
//         type: DataTypes.STRING,
//         field: 'last_name',
//       },
//       fullname: {
//         type: DataTypes.STRING,
//         field: 'full_name',
//       },
//       extraData: { type: DataTypes.INTEGER, field: 'extra_data' },
//       cityId: { type: DataTypes.INTEGER, field: 'city_id' },
//       districtId: { type: DataTypes.INTEGER, field: 'district_id' },
//       createdTime: {
//         allowNull: false,
//         defaultValue: moment().unix(),
//         type: DataTypes.INTEGER,
//         field: 'created_time',
//       },
//       createdBy: {
//         allowNull: false,
//         type: DataTypes.INTEGER,
//         field: 'created_by',
//       },
//       updatedTime: {
//         type: DataTypes.INTEGER,
//         field: 'updated_time',
//       },
//       updatedBy: {
//         type: DataTypes.INTEGER,
//         field: 'updated_by',
//       },
//     },
//     {
//       getterMethods: {
//         isActive() {
//           return getBooleanFromTinyint(this.getDataValue< User>('isActive'));
//         },
//       },
//       tableName: 'user_tab',
//       sequelize,
//     },
//   );
// }

export default function (dbConn: Sequelize, nameDefine = 'userTab'): ModelCtor<UserModel> {
  return dbConn.define(
    nameDefine,
    {
      uid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING },
      username: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      avatar: { type: DataTypes.STRING },
      salt: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
      isActive: { type: DataTypes.TINYINT, defaultValue: 1, field: 'is_active' },
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name',
      },
      fullname: {
        type: DataTypes.STRING,
        field: 'full_name',
      },
      extraData: { type: DataTypes.TEXT, field: 'extra_data' },
      cityId: { type: DataTypes.TEXT, field: 'city_id' },
      districtId: { type: DataTypes.TEXT, field: 'district_id' },
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
      tableName: 'user_tab',
    },
  );
}
