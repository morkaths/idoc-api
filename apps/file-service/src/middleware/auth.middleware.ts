
import { AuthClient } from '../integrations/auth.client';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

/**
 * Middleware to authenticate JWT token from Authorization header
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    if (!token) return res.status(401).json({ success: false, message: 'No authentication token provided' });

    // Verify token using AuthClient
    const user = await AuthClient.verifyToken(token);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' });
    
    (req as AuthRequest).user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      const user = await AuthClient.verifyToken(token);
      if (user) {
        (req as AuthRequest).user = user;
      }
    }
    next();
  } catch {
    next();
  }
};

/**
 * Middleware to authorize user based on role
 * @param allowedRoles Array of allowed role codes (e.g., ['admin', 'user'])
 * @returns Middleware function
 */
export const authorizeRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ensure user is authenticated
      const user = (req as AuthRequest).user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'You need to log in first' });
      }
      // Check if user has the required role
      const hasRole = user.roles?.some(role => allowedRoles.includes(role.code));
      if (!hasRole) {
        return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
      }
      next();
    } catch {
      return res.status(403).json({ success: false, message: 'Authorization failed' });
    }
  }
};
