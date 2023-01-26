import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      const user = await createdUser.save();
      return user;
    } catch (error) {
      if (/(email_1)[\s\S]+(dup key)/.test(error.message)) {
        throw new BadRequestException('User with this email already exists.');
      }
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(query: QueryUserDto) {
    const userQuery = this.userModel.find().sort({ _id: 1 });
    if (query.limit) {
      userQuery.limit(query.limit);
      userQuery.skip((query.page - 1) * query.limit);
    }
    const users = await userQuery;
    const totalUsers = await this.userModel.count();
    return { totalUsers, users };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getUserByEmail(username: string) {
    return this.userModel.findOne({ email: username });
  }
}
