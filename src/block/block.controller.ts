import { Controller, Post, Body, Req } from '@nestjs/common';
import { BlockService } from './block.service';
import { Request } from 'express';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post('block')
  async blockUser(@Req() req: Request, @Body('blockUserId') blockUserId: string) {
    if (typeof req.user === 'object' && 'id' in req.user) {
      const userId = req.user.id;
      return this.blockService.blockUser(userId, blockUserId);
    } else {
      throw new Error('Invalid user ID');
    }
  }

  @Post('unblock')
  async unblockUser(@Req() req: Request, @Body('unblockUserId') unblockUserId: string) {
    if (typeof req.user === 'object' && 'id' in req.user) {
      const userId = req.user.id;
      return this.blockService.unblockUser(userId, unblockUserId);
    } else {
      throw new Error('Invalid user ID');
    }
  }
}
