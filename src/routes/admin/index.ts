import UserRoute from './user.route';
import AuthRoute from './auth.route';

const adminRoute = [new UserRoute(), new AuthRoute()];

export default adminRoute;
