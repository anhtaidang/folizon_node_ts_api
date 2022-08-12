process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import adminRoute from './routes/admin';
import clientRoute from './routes/client';
import commonRoute from './routes/common';

validateEnv();

const app = new App([new IndexRoute(), ...adminRoute, ...clientRoute, ...commonRoute]);

app.listen();
