// import bcrypt from 'bcrypt';
import DB from '@databases';
import { CreateUserDTO, User } from '@interfaces/users.interface';
import { FindOptions } from 'sequelize/types/lib/model';

class UserService {
  public users = DB.Users;

  public async findAll(option?: FindOptions<User>): Promise<User[]> {
    return this.users.findAll(option);
  }

  public async findOne(option?: FindOptions<User>): Promise<User> {
    return this.users.findOne(option);
  }

  public async findById(userId: number): Promise<User> {
    return this.users.findByPk(userId);
  }

  public async create(userData: CreateUserDTO): Promise<User> {
    return this.users.create(userData);
  }
  //
  // public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
  //
  //   const findUser: User = await this.users.findByPk(userId);
  //   if (!findUser) throw new HttpException(409, "You're not user");
  //
  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   await this.users.update({ ...userData, password: hashedPassword }, { where: { id: userId } });
  //
  //   const updateUser: User = await this.users.findByPk(userId);
  //   return updateUser;
  // }
  //
  // public async deleteUser(userId: number): Promise<User> {
  //   if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
  //
  //   const findUser: User = await this.users.findByPk(userId);
  //   if (!findUser) throw new HttpException(409, "You're not user");
  //
  //   await this.users.destroy({ where: { id: userId } });
  //
  //   return findUser;
  // }
}

export default UserService;
