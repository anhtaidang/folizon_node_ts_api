import config from 'config';
import Sequelize from 'sequelize';
import { dbConfig } from '@interfaces/db.interface';
import UserModel from '@models/users.model';
import { logger } from '@utils/logger';

const { host, user, password, database, pool }: dbConfig = config.get('dbConfig');

const dbConn = new Sequelize.Sequelize(database, user, password, {
  host: host,
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

const DB = {
  Users,
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

export default DB;
