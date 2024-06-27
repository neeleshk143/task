import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
// import { JwtPayload } from './types';  // Import the custom JwtPayload
import { JwtPayload } from './custom';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.decode(token) as JwtPayload;
        req.user = decoded;
      } catch (err) {
        console.error('Invalid token');
      }
    }
    next();
  } 
}
