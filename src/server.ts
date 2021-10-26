process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
// import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import adminRoute from './routes/admin';

validateEnv();

// const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute()]);
const app = new App([new IndexRoute(), ...adminRoute]);

app.listen();
