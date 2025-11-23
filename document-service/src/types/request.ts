import { Request } from 'express';
import { User } from './auth.types';

export interface AuthRequest extends Request {
  user?: User;
}