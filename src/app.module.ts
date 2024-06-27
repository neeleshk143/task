import {  CacheModule } from '@nestjs/common/cache';
import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';
import { User, UserSchema } from './users/user.schema';
import { BlockController } from './block/block.controller';
import { BlockService } from './block/block.service';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost/user-management'),
    MongooseModule.forRoot('mongodb+srv://aneelesh342:5vypKuQkfOFSjzfL@cluster0.qejw8c4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register({
      ttl: 60 * 5, // 5 minutes
    }),
  ],
  controllers: [UserController, BlockController],
  providers: [UserService, BlockService],
})
export class AppModule {}
// tOgS5GGFa4SmLPDN


// mongodb+srv://aneelesh342:5vypKuQkfOFSjzfL@cluster0.qejw8c4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0