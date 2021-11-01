import config from 'config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import DB from '@databases';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { UserDTO } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import UserService from '@services/user.service';
import { FindOptions } from 'sequelize';

class AuthService {
  private users = DB.Users;

  private userService = new UserService();
  private authKey: string = config.get('authKey');
  private secretKey: string = config.get('authKey');

  public async getCurrentUserLogin(req) {
    let userLogin: UserDTO = null;
    const token = req.cookies[this.authKey as string] || req.headers[this.authKey as string];
    if (token) {
      const decoded = await jwt.verify(token, process.env.SECRET_KEY);
      if (decoded) {
        const { uid }: JwtPayload = decoded;
        userLogin = await this.userService.getUserInfoById(uid, { attributes: ['uid'] });
      }
    }
    return userLogin;
  }

  // public async signup(userData: CreateUserDto): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
  //
  //   const findUser: User = await this.users.findOne({ where: { email: userData.email } });
  //   if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);
  //
  //   // const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   // const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
  //
  //   // return createUserData;
  //   return;
  // }

  public async login(
    password: string,
    option?: FindOptions<UserDTO>,
  ): Promise<{ cookie?: string; user?: UserDTO; tokenData?: TokenData; errorMessage?: string }> {
    const findUser: UserDTO = await this.users.findOne({ where: { isActive: true, ...(option?.where || {}) } });
    if (!findUser) return { errorMessage: 'Tài khoản không tồn tại!' };

    // const isPasswordMatching: boolean = await bcrypt.compare(password, findUser.password);
    const isPasswordMatching: boolean = password === findUser.password;
    if (!isPasswordMatching) return { errorMessage: 'Tài khoản hoặc mật khẩu không đúng!' };

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, user: findUser, tokenData };
  }

  public async logout(userData: UserDTO): Promise<UserDTO> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: UserDTO = await this.users.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: UserDTO): TokenData {
    const dataStoredInToken: DataStoredInToken = { uid: user.uid, username: user.username, email: user.email };
    const jwtExpirySeconds = 86400 * 30;

    const accessToken = jwt.sign(dataStoredInToken, this.secretKey, {
      algorithm: 'HS256',
      expiresIn: jwtExpirySeconds, // expires in 24 hours
      // expiresIn: jwtExpirySeconds * 1000,
    });

    return { expiresIn: jwtExpirySeconds, accessToken };
  }

  public createCookie(tokenData: TokenData): string {
    // Authorization
    return `${this.authKey}=${tokenData.accessToken}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
