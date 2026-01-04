import { authenticate as sharedAuthenticate, authorize as sharedAuthorize } from '@libs/auth';
import { RedisClient } from '@libs/redis';
import { RSA_PUBLIC_KEY } from '../config/env.config';
import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const middleware = sharedAuthenticate({
    redis: RedisClient.instance,
    publicKey: RSA_PUBLIC_KEY
  });
  return middleware(req, res, next);
};

export const authorize = sharedAuthorize;
