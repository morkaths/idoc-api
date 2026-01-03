import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { RSA_PUBLIC_KEY } from '../config/env.config';

const redis = new Redis();
const ACCESS_BLACKLIST_PREFIX = 'blacklist:access:';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    let decoded: any;

    if (RSA_PUBLIC_KEY) {
      console.log('RSA_PUBLIC_KEY:', RSA_PUBLIC_KEY);
      try {
        decoded = jwt.verify(token, RSA_PUBLIC_KEY, { algorithms: ['RS256'] }) as any;
      } catch (error) {
        console.error('Token signature verification failed:', error);
        return res.status(401).json({ success: false, message: 'Invalid token signature' });
      }
    } else {
      console.warn('RSA_PUBLIC_KEY not provided, skipping signature verification');
      decoded = jwt.decode(token) as any;
    }

    if (!decoded || !decoded.jti) {
      return res.status(401).json({ success: false, message: 'Invalid token structure' });
    }

    // Check Blacklist
    const isBlacklisted = await redis.get(`${ACCESS_BLACKLIST_PREFIX}${decoded.jti}`);
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: 'Token revoked' });
    }

    (req as AuthRequest).user = {
      id: decoded.sub,
      email: decoded.email,
      username: decoded.username,
      roles: decoded.roles,
      permissions: decoded.permissions,
      status: 1
    };
    console.log((req as AuthRequest).user);
    next();
    return;
  } catch {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

/**
 * Middleware to authorize user based on role
 * @param allowedRoles Array of allowed role codes (e.g., ['admin', 'user'])
 * @returns Middleware function
 */
export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ensure user is authenticated
      const user = (req as AuthRequest).user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'You need to log in first' });
      }
      // Check if user has the required role
      const hasRole = user.roles?.some(role => allowedRoles.includes(role));
      if (!hasRole) {
        return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
      }
      next();
    } catch {
      return res.status(403).json({ success: false, message: 'Authorization failed' });
    }
  }
};
