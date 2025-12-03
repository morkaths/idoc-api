import { Response } from 'express';
import { User, Pagination } from '../types';

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  [key: string]: unknown;
}

interface ApiResponse {
  success: boolean;
  status: number;
  message?: string;
  data?: any;
  pagination?: Pagination | null;
  error?: unknown;
}

function send(
  res: Response,
  status: number,
  success: boolean,
  message = success ? 'Success' : 'Error',
  data: any = null,
  pagination: Pagination | null = null,
  error?: unknown
) {
  const payload: ApiResponse = { success, status, message, data };
  if (pagination) payload.pagination = pagination;
  if (error) payload.error = error;
  return res.status(status).json(payload);
}

export const paginated = (res: Response, message = 'Success', data: any[] = [], pagination: Pagination) =>
  send(res, 200, true, message, data, pagination);

export const success = (res: Response, message = 'Success', data: any = null) =>
  send(res, 200, true, message, data);

export const created = (res: Response, message = 'Created', data: any = null) =>
  send(res, 201, true, message, data);

export const updated = (res: Response, message = 'Updated', data: any = null) =>
  send(res, 200, true, message, data);

export const deleted = (res: Response, message = 'Deleted') =>
  send(res, 200, true, message, null);

export const noContent = (res: Response) => res.status(204).send();

export const badRequest = (res: Response, message = 'Bad request', error?: unknown) =>
  send(res, 400, false, message, null, null, error);

export const unauthorized = (res: Response, message = 'Unauthorized') =>
  send(res, 401, false, message);

export const forbidden = (res: Response, message = 'Forbidden') =>
  send(res, 403, false, message);

export const notFound = (res: Response, message = 'Not found') =>
  send(res, 404, false, message);

export const methodNotAllowed = (res: Response, message = 'Method Not Allowed') =>
  send(res, 405, false, message);

export const requestTimeout = (res: Response, message = 'Request Timeout') =>
  send(res, 408, false, message);

export const duplicate = (res: Response, message = 'Duplicate resource', error?: unknown) =>
  send(res, 409, false, message, null, null, error);

export const gone = (res: Response, message = 'Gone') =>
  send(res, 410, false, message);

export const unsupportedMediaType = (res: Response, message = 'Unsupported Media Type') =>
  send(res, 415, false, message);

export const unprocessable = (res: Response, message = 'Unprocessable Entity', error?: unknown) =>
  send(res, 422, false, message, null, null, error);

export const tooManyRequests = (res: Response, message = 'Too Many Requests') =>
  send(res, 429, false, message);

export const internalError = (res: Response, message = 'Internal server error', error?: unknown) => {
  if (error) console.error('InternalError:', error);
  return send(res, 500, false, message, null, null, error);
};

export const notImplemented = (res: Response, message = 'Not Implemented') =>
  send(res, 501, false, message);

export const serviceUnavailable = (res: Response, message = 'Service Unavailable') =>
  send(res, 503, false, message);