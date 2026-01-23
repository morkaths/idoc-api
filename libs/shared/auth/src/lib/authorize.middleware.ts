import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './type';

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
