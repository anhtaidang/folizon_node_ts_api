process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from 'config';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import DB from '@databases';
import RedisCacheManager from '@/cache/redis';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { createTerminus, HealthCheckError } from '@godaddy/terminus';

const options = {
  healthChecks: {
    '/healthcheck': () => {
      return Promise.resolve();
    },
  },
  beforeShutdown: () => {
    // Give it 5s to shutdown
    return new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
  },
  onSignal: () => {
    console.log('Signal recieved, start shutdowning server..');
    return Promise.all([RedisCacheManager.disconnectRedis()]);
    // return Promise.all([disconnectRedis()]);
  },
  onShutdown: () => {
    console.log('Graceful shutdowning server..');
    return Promise.resolve('OK');
  },
};

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    App.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    // this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private static connectToDatabase() {
    // DB.sequelize.sync({ force: false });
    DB.connect();
  }

  private initializeMiddlewares() {
    this.app.use(morgan(config.get('log.format'), { stream }));
    this.app.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    // this.app.use(express.json());
    this.app.use(express.json({ limit: '5mb', type: 'application/json' }));
    // this.app.use(
    //   bodyParser.urlencoded({
    //     extended: false,
    //   }),
    // );
    // this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    createTerminus(this.app, options);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
