import { Request, Response, NextFunction } from 'express';
import * as response from '../utils/response.util';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational || false;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((e: any) => e.message);
    return response.unprocessable(res, 'Validation Error', errors);
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return response.duplicate(res, `${field} already exists`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return response.unauthorized(res, 'Invalid token');
  }

  // JWT token expired error
  if (err.name === 'TokenExpiredError') {
    return response.unauthorized(res, 'Token expired');
  }

  // Default error
  if (err.statusCode === 400) {
    return response.badRequest(res, err.message || 'Bad Request');
  }
  if (err.statusCode === 404) {
    return response.notFound(res, err.message || 'Not found');
  }
  if (err.statusCode === 403) {
    return response.forbidden(res, err.message || 'Forbidden');
  }
  if (err.statusCode === 401) {
    return response.unauthorized(res, err.message || 'Unauthorized');
  }
  if (err.statusCode === 405) {
    return response.methodNotAllowed(res, err.message || 'Method Not Allowed');
  }
  if (err.statusCode === 409) {
    return response.duplicate(res, err.message || 'Duplicate');
  }
  if (err.statusCode === 422) {
    return response.unprocessable(res, err.message || 'Unprocessable Entity');
  }
  if (err.statusCode === 429) {
    return response.tooManyRequests(res, err.message || 'Too Many Requests');
  }
  if (err.statusCode === 502) {
    return response.badGateway(res, err.message || 'Bad Gateway');
  }
  if (err.statusCode === 503) {
    return response.serviceUnavailable(res, err.message || 'Service Unavailable');
  }
  if (err.statusCode === 504) {
    return response.gatewayTimeout(res, err.message || 'Gateway Timeout');
  }

  return response.internalError(
    res,
    err.message || 'Internal Server Error',
    process.env.NODE_ENV === 'development' ? (err.stack ? [err.stack] : undefined) : undefined
  );
};

export const asyncHandler = <Req = Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req as Req, res, next)).catch(next);
};

