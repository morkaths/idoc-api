import { Request } from 'express';
import { Redis } from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { AuthUser } from '@idoc-api/schema';

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface AuthConfig {
  redis: Redis;
  publicKey?: string;
  algorithms?: jwt.Algorithm[];
}
