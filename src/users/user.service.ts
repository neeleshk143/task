import { CACHE_MANAGER} from '@nestjs/common/cache';
import {Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateUserDto, UpdateUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { Cache } from 'cache-manager';
import { from } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    await this.cacheManager.del('users'); // Invalidate cache
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const cachedUsers = await this.cacheManager.get<User[]>('users');
    if (cachedUsers) {
      return cachedUsers;
    }
    const users = await this.userModel.find().exec();
    await this.cacheManager.set('users', users);
    return users;
  }

  async findOne(id: string): Promise<User> {
    const cachedUser = await this.cacheManager.get<User>(`user_${id}`);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userModel.findById(id).exec();
    if (user) {
      await this.cacheManager.set(`user_${id}`, user);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!existingUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    await this.cacheManager.set(`user_${id}`, existingUser);
    await this.cacheManager.del('users'); // Invalidate cache
    return existingUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (deletedUser) {
      await this.cacheManager.del(`user_${id}`);
      await this.cacheManager.del('users'); // Invalidate cache
    }
    return deletedUser;
  }

  async search(username?: string, minAge?: number, maxAge?: number): Promise<User[]> {
    const query: any = {};

    if (username) {
      query.username = new RegExp(username, 'i'); // Case insensitive search
    }

    if (minAge || maxAge) {
      const currentDate = new Date();
      if (minAge) {
        const minDate = new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate());
        query.birthdate = { ...query.birthdate, $lte: minDate };
      }
      if (maxAge) {
        const maxDate = new Date(currentDate.getFullYear() - maxAge, currentDate.getMonth(), currentDate.getDate());
        query.birthdate = { ...query.birthdate, $gte: maxDate };
      }
    }

    return this.userModel.find(query).exec();
  }
}
