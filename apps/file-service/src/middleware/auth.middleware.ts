import { Request, Response, NextFunction } from 'express';
import { config } from '@libs/config';
import { RedisClient } from '@libs/redis';
import { authenticate as sharedAuthenticate, authorize as sharedAuthorize } from '@libs/auth';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const middleware = sharedAuthenticate({
    redis: RedisClient.instance,
    publicKey: config.auth.rsaPublicKey
  });
  return middleware(req, res, next);
};

export const authorize = sharedAuthorize;
