import UserRoute from './user.route';
import AuthRoute from './auth.route';
import CategoryRoute from './category.route';

const adminRoute = [new UserRoute(), new AuthRoute(), new CategoryRoute];

export default adminRoute;
