import { Request } from 'express';
import { AuthUser } from '@libs/schema';
export * from '@libs/schema';

export interface AuthRequest extends Request {
  user: AuthUser;
}