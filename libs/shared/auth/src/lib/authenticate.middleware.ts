import { Request, Response, NextFunction } from 'express';
import { AuthRequest, AuthConfig } from './type';
import { TokenService } from './token.service';

export function authenticate(config: AuthConfig) {
  // Initialize TokenService with config
  const tokenService = new TokenService(config);

  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = await tokenService.verifyToken(token);

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
    } catch (error: any) {
      console.error('Token verification error:', error);
      const message = error.message === 'Token revoked' || error.message === 'Invalid token structure' 
        ? error.message 
        : 'Authentication failed';
     
      return res.status(401).json({ success: false, message });
    }
  };
}
