import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational || false;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((e: any) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // JWT token expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

