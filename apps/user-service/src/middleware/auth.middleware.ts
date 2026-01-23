import { authenticate as sharedAuthenticate, authorize as sharedAuthorize } from '@libs/auth';
import { RedisClient } from '@libs/redis';
import { config } from '@libs/config';
import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const middleware = sharedAuthenticate({
    redis: RedisClient.instance,
    publicKey: config.auth.jwtPublicKey
  });
  return middleware(req, res, next);
};

export const authorize = sharedAuthorize;
