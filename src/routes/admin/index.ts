import UserRoute from './user.route';
import AuthRoute from './auth.route';
import CategoryRoute from './category.route';
import ProductRoute from './product.route';

const adminRoute = [new UserRoute(), new AuthRoute(), new CategoryRoute(), new ProductRoute()];

export default adminRoute;
