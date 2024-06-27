import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';

@Injectable()
export class BlockService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { $addToSet: { blockedUsers: blockedUserId } }).exec();
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { $pull: { blockedUsers: blockedUserId } }).exec();
  }
}
