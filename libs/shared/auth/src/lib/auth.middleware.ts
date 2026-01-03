import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { AuthRequest } from '../type.js';

const ACCESS_BLACKLIST_PREFIX = 'blacklist:access:';

export function verifyTokenRevocation(redis: Redis) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Fast decode to get JTI and Claims (Gateway already verified signature)
      const decoded = jwt.decode(token) as any;
      
      if (!decoded || !decoded.jti) {
         return res.status(401).json({ message: 'Invalid token structure' });
      }

      // Check Blacklist
      const isBlacklisted = await redis.get(`${ACCESS_BLACKLIST_PREFIX}${decoded.jti}`);
      if (isBlacklisted) {
        return res.status(401).json({ message: 'Token revoked' });
      }

      // Populate User
      // Mapping decoded JWT payload to AuthUser interface
      // Adjust field mapping based on your JWT structure in Java Auth Service
      (req as AuthRequest).user = {
        id: decoded.sub, // Subject is usually User ID
        email: decoded.email,
        username: decoded.username,
        roles: decoded.roles,
        permissions: decoded.permissions,
        status: 1 // Default status or extract if available
      };

      next();
      return;
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
