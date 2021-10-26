import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  public username: string;
  @IsEmail()
  public email: string;
  @IsString()
  public password: string;
  public firstName: string;
  public lastName: string;
  public fullname: string;
  public avatar: string;
  public salt: string;
  public createdBy: number;
  public createdTime: number;
}
