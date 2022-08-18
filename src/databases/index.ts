import config from 'config';
import Sequelize from 'sequelize';
import { dbConfig } from '@interfaces/db.interface';
import { logger } from '@utils/logger';
import UserModel from '@models/users.model';
import CategoryModel from '@/models/category.model';
import ProductModel from '@/models/product.model';
import shopModel from '@/models/shop.model';

const { host, user, password, database, pool, port = 3306 }: dbConfig = config.get('dbConfig');

const dbConn = new Sequelize.Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
    timestamps: false,
  },
  pool: {
    min: pool.min,
    max: pool.max,
  },
  logQueryParameters: process.env.NODE_ENV === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

// sequelize.authenticate();

const Users = UserModel(dbConn);
Users.hasOne(Users, { sourceKey: 'createdBy', foreignKey: 'uid', as: 'userCreated' });
Users.hasOne(Users, { sourceKey: 'updatedBy', foreignKey: 'uid', as: 'userUpdated' });

const Category = CategoryModel(dbConn);
Category.hasOne(Users, { sourceKey: 'createdBy', foreignKey: 'uid', as: 'userCreated' });
Category.hasOne(Users, { sourceKey: 'updatedBy', foreignKey: 'uid', as: 'userUpdated' });

const Shop = shopModel(dbConn);
Shop.hasOne(Users, { sourceKey: 'uid', foreignKey: 'uid', as: 'userOwn' });
Shop.hasOne(Users, { sourceKey: 'createdBy', foreignKey: 'uid', as: 'userCreated' });
Shop.hasOne(Users, { sourceKey: 'updatedBy', foreignKey: 'uid', as: 'userUpdated' });

const Product = ProductModel(dbConn);
Product.hasOne(Shop, { sourceKey: 'shopId', foreignKey: 'id', as: 'shopMap' });
Product.hasOne(Category, { sourceKey: 'categoryId', foreignKey: 'id', as: 'categoryMap' });
Product.hasOne(Users, { sourceKey: 'createdBy', foreignKey: 'uid', as: 'userCreated' });
Product.hasOne(Users, { sourceKey: 'updatedBy', foreignKey: 'uid', as: 'userUpdated' });

const DB = {
  Users,
  Category,
  Product,
  Shop,
  sequelize: dbConn, // connection instance (RAW queries)
  Sequelize, // library
  connect: () => {
    dbConn
      .authenticate()
      .then(() => {
        console.log(`Mysql Host:${host} | User: ${user} | Database: ${database}`);
        console.log('Mysql Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  },
};

export const DBOp = Sequelize.Op;

export default DB;
