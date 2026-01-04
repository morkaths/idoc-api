import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { AuthUser } from '@idoc-api/schema';

export interface AuthRequest extends Request {
  user?: AuthUser;
}

const ACCESS_BLACKLIST_PREFIX = 'blacklist:access:';

export interface AuthConfig {
  redis: Redis;
  publicKey?: string;
  algorithms?: jwt.Algorithm[];
}

export function authenticate(config: AuthConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
      let decoded: any;

      if (config.publicKey) {
        try {
          decoded = jwt.verify(token, config.publicKey, { algorithms: config.algorithms || ['RS256'] }) as any;
        } catch (error) {
          console.error('Token signature verification failed:', error);
          return res.status(401).json({ success: false, message: 'Invalid token signature' });
        }
      } else {
        // Fallback to decode if no key provided (not recommended for production but supported for legacy/internal)
        decoded = jwt.decode(token) as any;
      }

      if (!decoded || !decoded.jti) {
        return res.status(401).json({ success: false, message: 'Invalid token structure' });
      }

      // Check Blacklist
      const isBlacklisted = await config.redis.get(`${ACCESS_BLACKLIST_PREFIX}${decoded.jti}`);
      if (isBlacklisted) {
        return res.status(401).json({ success: false, message: 'Token revoked' });
      }

      // Populate User
      (req as AuthRequest).user = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
        roles: decoded.roles,
        permissions: decoded.permissions,
        status: decoded.status || 1
      };

      next();
      return;
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
  };
}

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
      return;
    } catch {
      return res.status(403).json({ success: false, message: 'Authorization failed' });
    }
  }
};
