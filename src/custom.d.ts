// src/types.ts or src/custom.d.ts

import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export interface JwtPayload extends BaseJwtPayload {
  id: string;
}

// Extend the Express Request interface
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload | string;
  }
}
